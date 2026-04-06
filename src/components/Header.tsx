"use client";

export function Header() {
  return (
    <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse" />
        <h2 className="text-sm font-bold text-slate-700 tracking-tight">Vectorless RAG Engine</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Model: Llama 3.3 70b
        </div>
        <div className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-bold text-white shadow-md shadow-blue-100 uppercase tracking-wider">
          Groq Cloud
        </div>
      </div>
    </header>
  );
}
