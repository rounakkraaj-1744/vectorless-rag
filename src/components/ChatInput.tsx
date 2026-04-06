"use client";

import { Send as SendIcon } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSendMessage(query);
    setQuery("");
  };

  return (
    <div className="p-8 pb-10 bg-white bg-linear-to-t from-slate-50 to-white/0 font-sans">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="group relative">
          <div className="absolute inset-x-0 -top-px h-px bg-slate-100 group-focus-within:bg-blue-500 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your library..."
            className="w-full bg-slate-50 border border-slate-200 rounded-3xl pl-7 pr-16 py-5 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/30 transition-all placeholder:text-slate-400 shadow-xl shadow-slate-200/40 text-slate-900"
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
  );
}