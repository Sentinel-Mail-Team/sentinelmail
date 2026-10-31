import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Mail, Globe2, Server, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = { email: Mail, domain: Globe2, ip: Server, url: Link2 } as const;

export type CorrelationNodeData = {
  kind: keyof typeof iconMap;
  title: string;
  subtitle: string;
  tone: "critical" | "warning" | "cyan" | "safe";
};

const toneClasses: Record<CorrelationNodeData["tone"], string> = {
  critical: "border-critical/40 bg-critical/10 text-critical",
  warning: "border-warning/40 bg-warning/10 text-warning",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  safe: "border-safe/40 bg-safe/10 text-safe",
};

export function CorrelationNode({ data, selected }: NodeProps & { data: CorrelationNodeData }) {
  const Icon = iconMap[data.kind];
  return (
    <div
      className={cn(
        "rounded-lg border bg-surface px-4 py-3 min-w-[190px] shadow-lg shadow-black/20 transition-shadow",
        selected ? "border-cyan ring-2 ring-cyan/30" : "border-border"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-border-soft !border-none !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-border-soft !border-none !w-2 !h-2" />
      <div className="flex items-center gap-2.5">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md border", toneClasses[data.tone])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-mono text-text truncate">{data.title}</div>
          <div className="text-[10px] text-text-dim truncate mt-0.5">{data.subtitle}</div>
        </div>
      </div>
    </div>
  );
}
