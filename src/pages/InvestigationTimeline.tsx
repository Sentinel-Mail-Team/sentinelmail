/**
 * SentinelMail — Investigation Timeline
 * -----------------------------------------------------------------------
 * Route:        "/timeline"
 * Purpose:      Chronological event log of the automated analysis
 *               pipeline for a selected email (parse → auth check →
 *               link extraction → classification → report generated).
 * Data source:  `useAllEmails()` for the switcher, `useEmailById()` for
 *               the selected record's `timeline[]`.
 * -----------------------------------------------------------------------
 */
import { useSearchParams } from "react-router-dom";
import { Info, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { EmailSwitcher } from "@/components/EmailSwitcher";
import { useAllEmails, useEmailById } from "@/lib/emails";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/data/types";

const statusConfig: Record<TimelineEvent["status"], { icon: typeof Info; dot: string; text: string }> = {
  info: { icon: Info, dot: "bg-cyan", text: "text-cyan" },
  warning: { icon: AlertTriangle, dot: "bg-warning", text: "text-warning" },
  critical: { icon: ShieldAlert, dot: "bg-critical", text: "text-critical" },
  success: { icon: CheckCircle2, dot: "bg-safe", text: "text-safe" },
};

export function InvestigationTimeline() {
  const emails = useAllEmails();
  const [params, setParams] = useSearchParams();
  const emailId = params.get("email") ?? emails[0].id;
  const email = useEmailById(emailId) ?? emails[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text tracking-tight">Investigation Timeline</h1>
          <p className="text-sm text-text-muted mt-0.5">Chronological record of the automated analysis pipeline</p>
        </div>
        <EmailSwitcher selectedId={email.id} onChange={(id) => setParams({ email: id })} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{email.incidentId}</CardTitle>
            <CardDescription>{email.subject}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-border-soft ml-2 space-y-6 pt-1">
            {email.timeline.map((event) => {
              const cfg = statusConfig[event.status];
              const Icon = cfg.icon;
              return (
                <li key={`${event.time}-${event.label}`} className="ml-6">
                  <span
                    className={cn(
                      "absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-surface",
                      cfg.dot
                    )}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-text-dim">{event.time}</span>
                    <Icon className={cn("h-3.5 w-3.5", cfg.text)} />
                    <span className="text-sm font-medium text-text">{event.label}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-xl">{event.detail}</p>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
