import type { RiskLevel } from "@/data/types";
import { riskConfig } from "@/lib/risk";
import { cn } from "@/lib/utils";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const c = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium font-mono uppercase tracking-wide",
        c.bg,
        c.text,
        c.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

export function AuthPill({ result }: { result: "PASS" | "FAIL" | "NEUTRAL" }) {
  const map = {
    PASS: "bg-safe/10 text-safe border-safe/30",
    FAIL: "bg-critical/10 text-critical border-critical/30",
    NEUTRAL: "bg-warning/10 text-warning border-warning/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded border px-2.5 py-1 text-xs font-mono font-semibold tracking-wide", map[result])}>
      {result}
    </span>
  );
}
