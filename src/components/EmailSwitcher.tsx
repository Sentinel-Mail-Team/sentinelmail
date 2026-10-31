import { ChevronDown } from "lucide-react";
import { useAllEmails } from "@/lib/emails";
import { RiskBadge } from "@/components/ui/RiskBadge";
import type { EmailRecord } from "@/data/types";

export function EmailSwitcher({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const emails = useAllEmails();
  const selected = emails.find((e) => e.id === selectedId) ?? emails[0];

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={selected.id}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-md border border-border bg-surface-2 py-2 pl-3 pr-8 text-xs font-mono text-text focus:border-cyan/50 focus:outline-none cursor-pointer max-w-[280px] sm:max-w-none"
        >
          {emails.map((e: EmailRecord) => (
            <option key={e.id} value={e.id}>
              {e.id} — {e.subject.slice(0, 42)}
              {e.subject.length > 42 ? "…" : ""}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
      </div>
      <RiskBadge level={selected.riskLevel} />
    </div>
  );
}
