"use client";

export function Header() {
  return (
    <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse" />
        <h2 className="text-sm font-bold text-slate-700 tracking-tight text-center">Vectorless RAG Engine</h2>
      </div>
      {/* Meta tags removed as requested */}
    </header>
  );
}
