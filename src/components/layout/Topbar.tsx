import { Search, Bell, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
        <input
          type="text"
          placeholder="Search incidents, domains, IPs..."
          className="w-full rounded-md border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-dim focus:border-cyan/50 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-safe/30 bg-safe/10 px-3 py-1.5 text-xs font-medium text-safe">
          <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse-dot" />
          System Operational
        </div>

        <button className="relative rounded-md p-2 text-text-muted hover:bg-surface-2 hover:text-text transition-colors" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-critical" />
        </button>

        <button className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 hover:bg-surface-2 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-dim/40 text-xs font-semibold text-cyan border border-cyan/30">
            AR
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-medium text-text">Aditi Rao</div>
            <div className="text-[10px] text-text-dim">SOC Analyst</div>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-text-dim" />
        </button>
      </div>
    </header>
  );
}
