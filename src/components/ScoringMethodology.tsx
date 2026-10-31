import { useState } from "react";
import { ChevronDown, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const RULES: { label: string; weight: string; note: string }[] = [
  { label: "Baseline score", weight: "+4", note: "Starting point for every message before any rule fires." },
  { label: "Urgency / pressure language", weight: "+8 per phrase (max +20)", note: '"urgent", "verify now", "24 hours", "suspended", etc.' },
  { label: "Sender / brand domain mismatch", weight: "+25", note: "A known brand name is referenced but the sending domain has no relation to it." },
  { label: "Reply-To domain mismatch", weight: "+12", note: "Reply-To address resolves to a different domain than the From address." },
  { label: "Suspicious link pattern", weight: "+22", note: "URL shortener, IP-literal link, or a login/verify-style path in an extracted URL." },
  { label: "SPF / DKIM / DMARC failure", weight: "+18 each", note: "Parsed directly from the message's real Authentication-Results header, when present." },
  { label: "Risky attachment extension", weight: "+20", note: ".exe, .scr, .js, .vbs, .bat, .jar, .cmd, .ps1" },
];

const LEVELS = [
  { range: "0–14", label: "Safe" },
  { range: "15–39", label: "Low" },
  { range: "40–64", label: "Medium" },
  { range: "65–84", label: "High" },
  { range: "85–100", label: "Critical" },
];

export function ScoringMethodology({ isRealUpload }: { isRealUpload: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25">
            <Calculator className="h-4 w-4 text-cyan" />
          </div>
          <div>
            <CardTitle>How this score is calculated</CardTitle>
            <CardDescription>
              {isRealUpload
                ? "This message was scored live by the rule-based engine below."
                : "This is the same weighted rule engine that scores real uploads on the Analyze Email page."}
            </CardDescription>
          </div>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-text-dim shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <CardContent className="pt-0 space-y-4">
          <p className="text-xs text-text-muted leading-relaxed">
            SentinelMail does not use a trained ML model or an LLM for this score — it's a transparent,
            weighted rule engine (<code className="font-mono text-cyan/90">src/lib/analyzeEngine.ts</code>).
            Each triggered indicator below adds points to a baseline score, capped at 100, then mapped to a
            risk level.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border-soft">
            <table className="w-full text-xs">
              <thead className="bg-surface-2/60">
                <tr>
                  <th className="text-left font-medium uppercase tracking-wide text-text-dim px-3 py-2">Indicator</th>
                  <th className="text-left font-medium uppercase tracking-wide text-text-dim px-3 py-2">Weight</th>
                  <th className="text-left font-medium uppercase tracking-wide text-text-dim px-3 py-2">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {RULES.map((r) => (
                  <tr key={r.label}>
                    <td className="px-3 py-2 text-text font-medium whitespace-nowrap">{r.label}</td>
                    <td className="px-3 py-2 font-mono text-cyan whitespace-nowrap">{r.weight}</td>
                    <td className="px-3 py-2 text-text-muted">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <span key={l.label} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-[11px] font-mono text-text-muted">
                {l.range} → {l.label}
              </span>
            ))}
          </div>

          {!isRealUpload && (
            <p className="text-xs text-text-dim leading-relaxed border-t border-border-soft pt-3">
              This particular email is one of three curated demo samples with hand-written scores and threat
              intelligence, used to showcase the full correlation/campaign views. Upload your own <code className="font-mono">.eml</code> file
              from the Analyze Email page to see this engine run live.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
