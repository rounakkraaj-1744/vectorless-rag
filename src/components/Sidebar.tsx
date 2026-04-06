"use client";

import { useRef, useState } from "react";
import { Plus as PlusIcon, FileText as FileIcon, Book as BookIcon, Database as DbIcon, Upload as UploadIcon } from "lucide-react";
import { Document } from "@/types";
import { ingestDocumentAction } from "@/app/actions";

interface SidebarProps {
  documents: Document[];
  onIngestSuccess: () => void;
}

export function Sidebar({ documents, onIngestSuccess }: SidebarProps) {
  const [isIngesting, setIsIngesting] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: "", content: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIngesting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      await ingestDocumentAction({ title: file.name, content });
      onIngestSuccess();
      setIsIngesting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.content || isIngesting) return;

    setIsIngesting(true);
    try {
      await ingestDocumentAction(newDoc);
      setNewDoc({ title: "", content: "" });
      onIngestSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <aside className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-sm">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileUpload}
        accept=".txt,.md,.js,.ts,.json"
      />
      
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
          <DbIcon className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">RAG Vault</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-slate-900 font-sans">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <PlusIcon className="w-3.5 h-3.5" /> Add Knowledge
            </h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 transition-colors"
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
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium text-slate-900 font-sans">
                    {doc.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}