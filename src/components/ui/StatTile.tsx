import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "critical" | "warning" | "safe" | "cyan";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "text-text-muted bg-surface-3 border-border",
    critical: "text-critical bg-critical/10 border-critical/25",
    warning: "text-warning bg-warning/10 border-warning/25",
    safe: "text-safe bg-safe/10 border-safe/25",
    cyan: "text-cyan bg-cyan/10 border-cyan/25",
  };

  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">{label}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-text">{value}</div>
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md border shrink-0", toneClasses[tone])}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
