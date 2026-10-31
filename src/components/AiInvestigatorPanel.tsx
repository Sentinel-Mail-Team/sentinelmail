import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import type { EmailRecord } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function AiInvestigatorPanel({ email }: { email: EmailRecord }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [asked, setAsked] = useState<number[]>([]);

  const handleAsk = (idx: number) => {
    setSelected(idx);
    setAsked((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-cyan" /> AI Investigator
          </CardTitle>
          <CardDescription>Evidence-based answers grounded in this incident's data</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {email.aiQa.map((qa, idx) => (
            <button
              key={qa.question}
              onClick={() => handleAsk(idx)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors text-left",
                selected === idx
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-border bg-surface-2 text-text-muted hover:text-text hover:border-border-soft"
              )}
            >
              {qa.question}
            </button>
          ))}
        </div>

        {selected !== null && (
          <div className="rounded-lg border border-border bg-surface-2/60 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              AI-generated investigation summary
            </div>
            <p className="text-sm text-text leading-relaxed">{email.aiQa[selected].answer}</p>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            placeholder="Ask a follow-up question about this incident..."
            className="w-full rounded-md border border-border bg-surface-2 py-2.5 pl-3.5 pr-10 text-sm text-text placeholder:text-text-dim focus:border-cyan/50 focus:outline-none"
            disabled
          />
          <Send className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
        </div>
        {asked.length === 0 && (
          <p className="text-xs text-text-dim">Select a suggested question above to see the AI Investigator's analysis.</p>
        )}
      </CardContent>
    </Card>
  );
}
