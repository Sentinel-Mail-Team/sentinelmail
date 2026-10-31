/**
 * SentinelMail — Analysis Results
 * -----------------------------------------------------------------------
 * Route:        "/analysis/:emailId"
 * Purpose:      The core investigation view for a single email — risk
 *               score dial, explainable indicators, SPF/DKIM/DMARC
 *               results in plain language, cross-links into deeper
 *               views, the AI Investigator panel, and the transparent
 *               scoring methodology breakdown.
 * Data source:  `useEmailById(emailId)` — resolves against real uploaded
 *               emails first, falling back to the curated demo set.
 * -----------------------------------------------------------------------
 */
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Radar,
  Waypoints,
  Clock,
  FileText,
  Paperclip,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskBadge, AuthPill } from "@/components/ui/RiskBadge";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { AiInvestigatorPanel } from "@/components/AiInvestigatorPanel";
import { ScoringMethodology } from "@/components/ScoringMethodology";
import { useEmailById } from "@/lib/emails";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function AnalysisResults() {
  const { emailId } = useParams<{ emailId: string }>();
  const navigate = useNavigate();
  const email = useEmailById(emailId);

  if (!email) {
    return (
      <div className="text-sm text-text-muted">
        No analysis found for this email.{" "}
        <button className="text-cyan underline" onClick={() => navigate("/analyze")}>
          Analyze another email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-text-dim">
            <span>{email.incidentId}</span>
            <span>·</span>
            <span>{email.id}</span>
          </div>
          <h1 className="text-lg font-semibold text-text tracking-tight mt-1">Analysis Results</h1>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/reports?incident=${email.incidentId}`)}>
          <FileText className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      {/* Risk summary */}
      <Card>
        <CardContent className="pt-5 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <ScoreDial score={email.riskScore} />
            <RiskBadge level={email.riskLevel} />
          </div>
          <div className="space-y-3 min-w-0">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">Threat Type</div>
              <div className="text-base font-semibold text-text mt-0.5">{email.threatType}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Field label="Subject" value={email.subject} mono={false} />
              <Field label="From" value={email.from} mono />
              <Field label="To" value={email.to} mono />
              <Field label="Received" value={format(new Date(email.receivedAt), "MMM d, yyyy · HH:mm 'IST'")} />
            </div>
            {email.attachments.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-text-muted pt-1">
                <Paperclip className="h-3.5 w-3.5" />
                {email.attachments.map((a) => (
                  <span key={a.name} className="font-mono">{a.name}</span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Indicators */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Explainable Indicators</CardTitle>
              <CardDescription>What drove this classification</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {email.indicators.map((ind) => (
                <li key={ind.label} className="flex gap-3">
                  {ind.detected ? (
                    <XCircle className="h-4 w-4 text-critical shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-safe shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <div className={cn("text-sm font-medium", ind.detected ? "text-text" : "text-text-muted")}>
                      {ind.label}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{ind.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Email Authentication</CardTitle>
              <CardDescription>SPF, DKIM, and DMARC results explained</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {email.auth.map((a) => (
                <li key={a.protocol} className="flex gap-3">
                  <AuthPill result={a.result} />
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-text-dim">{a.detail}</div>
                    <div className="text-sm text-text-muted mt-1 leading-relaxed">{a.plainLanguage}</div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cross-links to deeper views */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <NavCard
          icon={Radar}
          title="Threat Intelligence"
          description={`${email.ips.length} IP · ${email.domains.length} domain · ${email.urls.length} URL lookups`}
          onClick={() => navigate(`/threat-intelligence?email=${email.id}`)}
        />
        <NavCard
          icon={Waypoints}
          title="Correlation Graph"
          description={email.campaignId ? "Linked to an active campaign" : "No related campaign detected"}
          onClick={() => navigate(`/correlation?email=${email.id}`)}
        />
        <NavCard
          icon={Clock}
          title="Investigation Timeline"
          description={`${email.timeline.length} logged events`}
          onClick={() => navigate(`/timeline?email=${email.id}`)}
        />
      </div>

      <AiInvestigatorPanel email={email} />

      <ScoringMethodology isRealUpload={email.id.startsWith("EML-U")} />
    </div>
  );
}

function Field({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">{label}</div>
      <div className={cn("text-text mt-0.5 truncate", mono && "font-mono text-xs")}>{value}</div>
    </div>
  );
}

function NavCard({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: typeof Radar;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-4 text-left hover:border-cyan/30 hover:bg-surface-2/60 transition-colors group"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25">
        <Icon className="h-4.5 w-4.5 text-cyan" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-text">{title}</div>
        <div className="text-xs text-text-muted mt-0.5 truncate">{description}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-text-dim group-hover:text-cyan transition-colors shrink-0" />
    </button>
  );
}
