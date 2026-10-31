import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  Radar,
  Waypoints,
  History as HistoryIcon,
  FileText,
  Clock,
  Settings,
  ShieldHalf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/analyze", label: "Analyze Email", icon: ScanSearch },
  { to: "/threat-intelligence", label: "Threat Intelligence", icon: Radar },
  { to: "/correlation", label: "Correlation Graph", icon: Waypoints },
  { to: "/timeline", label: "Investigation Timeline", icon: Clock },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 border border-cyan/30">
          <ShieldHalf className="h-4.5 w-4.5 text-cyan" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-text tracking-tight">SentinelMail</div>
          <div className="text-[10px] text-text-dim font-mono">SOC CONSOLE</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-cyan/10 text-cyan border border-cyan/20"
                  : "text-text-muted hover:text-text hover:bg-surface-2 border border-transparent"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-[11px] text-text-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse-dot" />
          Threat feeds synced 2m ago
        </div>
      </div>
    </aside>
  );
}
