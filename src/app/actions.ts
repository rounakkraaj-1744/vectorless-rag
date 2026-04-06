"use server";

import { searchDB } from "@/lib/search";
import { generateResponse } from "@/lib/ai";
import type { Document } from "@/types";
import { extractText } from "unpdf";

export async function ingestDocumentAction(data: { title: string; content: string; metadata?: Record<string, any> }) {
  const doc: Document = {
    id: Math.random().toString(36).substring(7),
    title: data.title,
    content: data.content,
    metadata: data.metadata || {},
  };

  searchDB.add(doc);
  return { success: true, doc };
}

export async function ingestPdfAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const binary = new Uint8Array(await file.arrayBuffer());
  const { text, totalPages } = await extractText(binary);
  
  const fullText = Array.isArray(text) ? text.join("\n\n") : text;
  
  const doc: Document = {
    id: Math.random().toString(36).substring(7),
    title: file.name,
    content: fullText,
    metadata: { pages: totalPages },
  };

  searchDB.add(doc);
  
  return { success: true, doc };
}

export async function queryRAGAction(query: string) {
  const relevantDocs = searchDB.query(query);

  if (relevantDocs.length === 0) {
    return { 
      answer: "I couldn't find any documents locally that match your question. Please ingest some relevant content!",
      sources: []
    };
  }

  const context = relevantDocs
    .map((doc, idx) => `Document ${idx + 1} (${doc.title}):\n${doc.content}`)
    .join("\n\n---\n\n");

  const prompt = `
    Answer the user query based ONLY on the provided local documents. 
    If not found, explain that knowledge is missing.

    CONTEXT:
    ${context}

    USER QUERY:
    ${query}

    ANSWER:
  `;

  const answer = await generateResponse(prompt);
  return { answer, sources: relevantDocs.map(d => d.title) };
}

export async function getDocumentsAction() {
  return searchDB.getAll();
}