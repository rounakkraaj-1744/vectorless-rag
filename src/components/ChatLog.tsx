"use client";

import { Message } from "@/types";
import { Brain as BrainIcon, Search as SearchIcon, CheckCircle as CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatLogProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatLog({ messages, isLoading }: ChatLogProps) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-12 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-1000">
            <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 shadow-inner font-sans">
              <BrainIcon className="w-10 h-10 text-blue-600 blur-[0.3px]" />
            </div>
            <h3 className="text-3xl font-bold mb-3 tracking-tight text-slate-900 font-sans">Query your Knowledge</h3>
            <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed font-sans">
              Fast, accurate retrieval without vector databases. Ingest any content to start.
            </p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={cn(
              "flex gap-5 p-6 rounded-2xl transition-all animate-in slide-in-from-bottom-2 duration-500 font-sans",
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
                <div className="flex flex-wrap gap-2 pt-2 text-slate-900 font-sans font-bold uppercase tracking-wider">
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
  );
}