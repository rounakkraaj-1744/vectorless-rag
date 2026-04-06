"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatLog } from "@/components/ChatLog";
import { ChatInput } from "@/components/ChatInput";
import { Header } from "@/components/Header";
import { queryRAGAction, getDocumentsAction } from "./actions";
import { Message, Document } from "@/types";

export default function RAGDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const docs = await getDocumentsAction();
      setDocuments(docs as Document[]);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const handleSendMessage = async (query: string) => {
    const userMsg: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await queryRAGAction(query);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: result.answer, 
          sources: result.sources 
        }
      ]);
    } 
    catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops! Something went wrong." }]);
    } 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <Sidebar documents={documents} onIngestSuccess={fetchDocs} />

      <main className="flex-1 flex flex-col bg-white">
        <Header />
        <ChatLog messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}