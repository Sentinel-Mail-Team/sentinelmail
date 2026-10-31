/**
 * SentinelMail — Reports
 * -----------------------------------------------------------------------
 * Route:        "/reports"
 * Purpose:      Full forensic report for a single incident — threat
 *               classification, metadata, authentication results,
 *               domains/IPs/URLs, timeline, and AI investigation
 *               summary. Supports Print / Export via the browser's
 *               native print dialog.
 * Data source:  `useEmailByIncidentId()` — resolves real uploads first,
 *               falls back to the curated demo set.
 * -----------------------------------------------------------------------
 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileText, Printer, RefreshCw, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskBadge, AuthPill } from "@/components/ui/RiskBadge";
import { campaign } from "@/data/mock";
import { useAllEmails, useEmailByIncidentId } from "@/lib/emails";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function Reports() {
  const emails = useAllEmails();
  const [params, setParams] = useSearchParams();
  const incidentId = params.get("incident") ?? emails[0].incidentId;
  const email = useEmailByIncidentId(incidentId) ?? emails[0];
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 900);
  };

  const isCampaignMember = email.campaignId === campaign.id;
  const isRealUpload = email.id.startsWith("EML-U");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-lg font-semibold text-text tracking-tight">Reports</h1>
          <p className="text-sm text-text-muted mt-0.5">Forensic investigation report for a completed analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={incidentId}
            onChange={(e) => setParams({ incident: e.target.value })}
            className="rounded-md border border-border bg-surface-2 py-2 px-3 text-xs font-mono text-text focus:border-cyan/50 focus:outline-none"
          >
            {emails.map((e) => (
              <option key={e.incidentId} value={e.incidentId}>{e.incidentId}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={handleGenerate} disabled={generating}>
            <RefreshCw className={cn("h-4 w-4", generating && "animate-spin")} />
            {generating ? "Generating..." : "Generate Report"}
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print / Export Report
          </Button>
        </div>
      </div>

      <Card className="print:border-none print:shadow-none">
        <CardContent className="pt-6 space-y-8">
          {/* Report header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25">
                <ShieldCheck className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <div className="text-base font-semibold text-text">SentinelMail Forensic Report</div>
                <div className="text-xs text-text-dim font-mono mt-0.5">{email.incidentId} · Generated {format(new Date(), "MMM d, yyyy")}</div>
              </div>
            </div>
            <RiskBadge level={email.riskLevel} className="text-sm px-3 py-1" />
          </div>

          <ReportSection title="Threat Classification">
            <SummaryGrid>
              <SummaryItem label="Threat Type" value={email.threatType} />
              <SummaryItem label="Risk Score" value={`${email.riskScore} / 100`} mono />
              <SummaryItem label="Incident ID" value={email.incidentId} mono />
              <SummaryItem label="Message ID" value={email.id} mono />
            </SummaryGrid>
          </ReportSection>

          <ReportSection title="Email Metadata">
            <SummaryGrid>
              <SummaryItem label="Subject" value={email.subject} />
              <SummaryItem label="From" value={email.from} mono />
              <SummaryItem label="To" value={email.to} mono />
              <SummaryItem label="Received" value={format(new Date(email.receivedAt), "MMM d, yyyy · HH:mm 'IST'")} />
            </SummaryGrid>
          </ReportSection>

          <ReportSection title="Authentication Results">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {email.auth.map((a) => (
                <div key={a.protocol} className="rounded-lg border border-border-soft bg-surface-2/50 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-text-muted">{a.protocol}</span>
                    <AuthPill result={a.result} />
                  </div>
                  <p className="text-[11px] font-mono text-text-dim">{a.detail}</p>
                </div>
              ))}
            </div>
          </ReportSection>

          {email.domains.length > 0 && (
            <ReportSection title="Domains">
              <DataList
                rows={email.domains.map((d) => ({ id: d.domain, cols: [d.domain, d.reputation, d.riskLevel] }))}
                headers={["Domain", "Reputation", "Risk"]}
              />
            </ReportSection>
          )}

          {email.ips.length > 0 && (
            <ReportSection title="IP Addresses">
              <DataList
                rows={email.ips.map((ip) => ({ id: ip.ip, cols: [ip.ip, ip.approximateLocation, ip.riskLevel] }))}
                headers={["IP Address", "Approximate Location", "Risk"]}
              />
            </ReportSection>
          )}

          {email.urls.length > 0 && (
            <ReportSection title="URLs">
              <DataList
                rows={email.urls.map((u) => ({ id: u.url, cols: [u.url, u.category, u.riskLevel] }))}
                headers={["URL", "Category", "Risk"]}
              />
            </ReportSection>
          )}

          <ReportSection title="Threat Intelligence Summary">
            <p className="text-sm text-text-muted leading-relaxed">
              {isRealUpload
                ? `Indicators were checked against rule-based message patterns only — this demo does not have a live threat-intelligence feed (e.g. VirusTotal, URLhaus) connected. ${email.domains.filter((d) => d.reputation !== "unknown").length} domain(s) and ${email.urls.filter((u) => u.reputation !== "unknown").length} URL(s) matched a suspicious pattern.`
                : email.ips.length > 0 || email.domains.length > 0
                ? `Indicators extracted from this message were checked against threat intelligence feeds. ${email.domains.filter((d) => d.reputation === "malicious").length} domain(s) and ${email.ips.filter((i) => i.reputation === "malicious").length} IP address(es) returned a malicious reputation.`
                : "No indicators from this message returned a malicious or suspicious reputation."}
            </p>
          </ReportSection>

          <ReportSection title="Related Incidents">
            {isCampaignMember ? (
              <p className="text-sm text-text-muted leading-relaxed">
                This incident is part of <span className="font-mono text-text">{campaign.id}</span> ({campaign.name}),
                which correlates {campaign.relatedIncidents} related incidents with {campaign.confidence}% confidence based
                on shared domain <span className="font-mono text-text">{campaign.sharedDomain}</span> and IP{" "}
                <span className="font-mono text-text">{campaign.sharedIp}</span>.
              </p>
            ) : (
              <p className="text-sm text-text-muted">No related incidents were correlated with this message.</p>
            )}
          </ReportSection>

          <ReportSection title="Investigation Timeline">
            <ul className="space-y-2">
              {email.timeline.map((t) => (
                <li key={`${t.time}-${t.label}`} className="flex gap-3 text-sm">
                  <span className="font-mono text-text-dim w-12 shrink-0">{t.time}</span>
                  <span className="text-text-muted">{t.label}</span>
                </li>
              ))}
            </ul>
          </ReportSection>

          <ReportSection title="AI Investigation Summary">
            <div className="space-y-3">
              {email.aiQa.slice(0, 2).map((qa) => (
                <div key={qa.question} className="rounded-lg border border-border-soft bg-surface-2/50 p-3.5">
                  <div className="text-xs font-medium text-cyan mb-1">{qa.question}</div>
                  <p className="text-sm text-text-muted leading-relaxed">{qa.answer}</p>
                </div>
              ))}
            </div>
          </ReportSection>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-text flex items-center gap-2">
        <FileText className="h-3.5 w-3.5 text-cyan" /> {title}
      </h2>
      {children}
    </div>
  );
}

function SummaryGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">{children}</div>;
}

function SummaryItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">{label}</div>
      <div className={cn("text-text mt-0.5", mono && "font-mono text-xs")}>{value}</div>
    </div>
  );
}

function DataList({ headers, rows }: { headers: string[]; rows: { id: string; cols: string[] }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-soft">
      <table className="w-full text-xs">
        <thead className="bg-surface-2/60">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left font-medium uppercase tracking-wide text-text-dim px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-soft">
          {rows.map((r) => (
            <tr key={r.id}>
              {r.cols.map((c, i) => (
                <td key={i} className={cn("px-3 py-2 text-text", i === 0 && "font-mono break-all")}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
