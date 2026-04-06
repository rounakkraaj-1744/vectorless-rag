"use client";

import { useState, useEffect, useRef } from "react";
import { Send as SendIcon, Book as BookIcon, Plus as PlusIcon, FileText as FileIcon, Brain as BrainIcon, Search as SearchIcon, CheckCircle as CheckIcon, Database as DbIcon, Upload as UploadIcon } from "lucide-react";
import { ingestDocumentAction, queryRAGAction, getDocumentsAction } from "./actions";
import { Message } from "@/types";
import { cn } from "@/lib/utils";

export default function RAGDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  
  const [newDoc, setNewDoc] = useState({ title: "", content: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const docs = await getDocumentsAction();
    setDocuments(docs);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIngesting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      await ingestDocumentAction({ title: file.name, content });
      await fetchDocs();
      setIsIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const handleQuery = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg = { role: "user" as const, content: query };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
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
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops! Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.content || isIngesting) return;

    setIsIngesting(true);
    try {
      await ingestDocumentAction(newDoc);
      setNewDoc({ title: "", content: "" });
      await fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
        accept=".txt,.md,.js,.ts,.json"
      />

      <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <DbIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">RAG Vault</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <PlusIcon className="w-3.5 h-3.5" /> Add Knowledge
              </h2>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                title="Upload Text File"
              >
                <UploadIcon className="w-3 h-3" /> UPLOAD
              </button>
            </div>
            <form onSubmit={handleIngest} className="space-y-3">
              <input
                type="text"
                placeholder="Document Title"
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
              />
              <textarea
                placeholder="Content..."
                value={newDoc.content}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
              />
              <button
                disabled={isIngesting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isIngesting ? "Saving..." : <><PlusIcon className="w-4 h-4" /> Ingest Doc</>}
              </button>
            </form>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4 px-1">
              <BookIcon className="w-3.5 h-3.5" /> Library ({documents.length})
            </h2>
            <div className="space-y-2.5">
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400 italic font-medium">Vault is empty.</p>
                </div>
              ) : (
                documents.map((doc, i) => (
                  <div key={i} className="group p-3.5 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-50/50 transition-all duration-300 cursor-default">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FileIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-sm font-semibold truncate text-slate-700">{doc.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {doc.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col world bg-white">
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-700 tracking-tight">Vectorless RAG Engine</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Model: Llama 3.3 70b
            </div>
            <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold text-white shadow-md shadow-blue-100">
              Groq Cloud
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-12 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-1000">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 shadow-inner">
                  <BrainIcon className="w-10 h-10 text-blue-600 blur-[0.3px]" />
                </div>
                <h3 className="text-3xl font-extra-bold mb-3 tracking-tight text-slate-900 font-sans">Query your Knowledge</h3>
                <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed">
                  Fast, accurate retrieval without vector databases. Ingest any content to start.
                </p>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex gap-5 p-6 rounded-2xl transition-all animate-in slide-in-from-bottom-2 duration-500",
                  m.role === "user" ? "bg-slate-50/80 border border-slate-100" : "bg-white border border-slate-100 shadow-sm"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  m.role === "user" ? "bg-slate-200 text-slate-600" : "bg-blue-600 text-white shadow-blue-100 shadow-md"
                )}>
                  {m.role === "user" ? <SearchIcon className="w-5 h-5" /> : <BrainIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="text-[15px] leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                    {m.content}
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {m.sources.map((s, j) => (
                        <span key={j} className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 bg-white border border-slate-200 text-blue-600 rounded-full flex items-center gap-1.5 shadow-sm">
                          <CheckIcon className="w-3 h-3" /> Source: {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-5 p-6 animate-pulse opacity-60">
                <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0 shadow-sm" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full w-full" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 pb-10 bg-white bg-linear-to-t from-slate-50 to-white/0">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleQuery} className="group relative">
              <div className="absolute inset-x-0 -top-px h-px bg-slate-100 group-focus-within:bg-blue-500 transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your library..."
                className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-7 pr-16 py-5 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-slate-400 shadow-xl shadow-slate-200/40"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-200 active:scale-90"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 mt-5">
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px]">
                Vectorless Retrieval • Groq Engine
              </p>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}