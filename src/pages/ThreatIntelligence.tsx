/**
 * SentinelMail — Threat Intelligence
 * -----------------------------------------------------------------------
 * Route:        "/threat-intelligence"
 * Purpose:      Reputation lookups for the IPs, domains, and URLs
 *               extracted from a selected email. For curated demo
 *               emails this shows hand-written threat-intel data; for
 *               real uploads every entry is honestly labeled as
 *               pattern-based (no live feed connected in this MVP).
 * Data source:  `useAllEmails()` for the switcher list, `useEmailById()`
 *               for the selected record's `ips[]` / `domains[]` / `urls[]`.
 * -----------------------------------------------------------------------
 */
import { useSearchParams } from "react-router-dom";
import { MapPin, Server, Globe2, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { EmailSwitcher } from "@/components/EmailSwitcher";
import { useAllEmails, useEmailById } from "@/lib/emails";
import { cn } from "@/lib/utils";

const reputationTone: Record<string, string> = {
  malicious: "text-critical",
  suspicious: "text-warning",
  unknown: "text-text-muted",
  clean: "text-safe",
};

export function ThreatIntelligence() {
  const emails = useAllEmails();
  const [params, setParams] = useSearchParams();
  const emailId = params.get("email") ?? emails[0].id;
  const email = useEmailById(emailId) ?? emails[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text tracking-tight">Threat Intelligence</h1>
          <p className="text-sm text-text-muted mt-0.5">Reputation lookups for indicators extracted from this email</p>
        </div>
        <EmailSwitcher selectedId={email.id} onChange={(id) => setParams({ email: id })} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2"><Server className="h-4 w-4 text-cyan" /> IP Addresses</CardTitle>
            <CardDescription>Origin infrastructure behind this message</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {email.ips.length === 0 && <EmptyRow text="No suspicious IP addresses associated with this email." />}
          {email.ips.map((ip) => (
            <div key={ip.ip} className="rounded-lg border border-border-soft bg-surface-2/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm text-text">{ip.ip}</span>
                <RiskBadge level={ip.riskLevel} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{ip.approximateLocation}</span>
                <span className="font-mono">{ip.asn}</span>
                <span className={cn("font-medium capitalize", reputationTone[ip.reputation])}>{ip.reputation}</span>
              </div>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">{ip.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-cyan" /> Domains</CardTitle>
            <CardDescription>Sending and linked domains</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {email.domains.length === 0 && <EmptyRow text="No suspicious domains associated with this email." />}
          {email.domains.map((d) => (
            <div key={d.domain} className="rounded-lg border border-border-soft bg-surface-2/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm text-text">{d.domain}</span>
                <RiskBadge level={d.riskLevel} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span>Registered {d.registered}</span>
                <span>{d.registrar}</span>
                <span className={cn("font-medium capitalize", reputationTone[d.reputation])}>{d.reputation}</span>
              </div>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">{d.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2"><Link2 className="h-4 w-4 text-cyan" /> URLs</CardTitle>
            <CardDescription>Links extracted from the message body</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {email.urls.length === 0 && <EmptyRow text="No URLs found in this email." />}
          {email.urls.map((u) => (
            <div key={u.url} className="rounded-lg border border-border-soft bg-surface-2/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-text break-all">{u.url}</span>
                <RiskBadge level={u.riskLevel} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                <span>{u.category}</span>
                <span className={cn("font-medium capitalize", reputationTone[u.reputation])}>{u.reputation}</span>
              </div>
              <p className="mt-2 text-xs text-text-muted leading-relaxed">{u.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-sm text-text-muted py-2">{text}</p>;
}
