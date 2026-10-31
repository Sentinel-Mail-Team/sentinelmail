/**
 * SentinelMail — Dashboard
 * -----------------------------------------------------------------------
 * Route:        "/"
 * Purpose:      Landing screen of the SOC console. Gives an at-a-glance
 *               summary of organization-wide email threat activity:
 *               volume KPIs, a 7-day threat trend, a classification
 *               breakdown, and the most recently processed incidents.
 * Data source:  `dashboardStats` (curated demo totals) + real uploaded
 *               emails from the current session via `useRecentInvestigations()`
 *               — real uploads are surfaced first, labeled "You (uploaded)".
 * -----------------------------------------------------------------------
 */
import { useNavigate } from "react-router-dom";
import { Mail, ShieldAlert, AlertTriangle, Network, Globe2, Waypoints, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatTile } from "@/components/ui/StatTile";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { ThreatTrendChart } from "@/components/charts/ThreatTrendChart";
import { ThreatDistributionChart } from "@/components/charts/ThreatDistributionChart";
import { dashboardStats } from "@/data/mock";
import { useRecentInvestigations } from "@/lib/emails";
import { format } from "date-fns";

export function Dashboard() {
  const navigate = useNavigate();
  const recentInvestigations = useRecentInvestigations();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted mt-0.5">Overview of email threat activity across your organization</p>
        </div>
        <Button onClick={() => navigate("/analyze")}>
          <ScanIcon /> Analyze New Email
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatTile label="Emails Analyzed" value={dashboardStats.emailsAnalyzed.toLocaleString()} icon={Mail} tone="cyan" />
        <StatTile label="Threats Detected" value={dashboardStats.threatsDetected} icon={ShieldAlert} tone="critical" />
        <StatTile label="High Risk Incidents" value={dashboardStats.highRiskIncidents} icon={AlertTriangle} tone="warning" />
        <StatTile label="Suspicious IPs" value={dashboardStats.suspiciousIps} icon={Network} tone="neutral" />
        <StatTile label="Suspicious Domains" value={dashboardStats.suspiciousDomains} icon={Globe2} tone="neutral" />
        <StatTile label="Related Campaigns" value={dashboardStats.relatedCampaigns} icon={Waypoints} tone="safe" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Threat Trend</CardTitle>
              <CardDescription>Daily volume by classification, last 7 days</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ThreatTrendChart />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Threat Distribution</CardTitle>
              <CardDescription>By classification, all time</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ThreatDistributionChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent Investigations</CardTitle>
            <CardDescription>Most recently processed incidents</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <THead>
              <TR>
                <TH>Incident</TH>
                <TH>Subject</TH>
                <TH>Risk</TH>
                <TH>Score</TH>
                <TH>Received</TH>
                <TH>Analyst</TH>
              </TR>
            </THead>
            <TBody>
              {recentInvestigations.slice(0, 6).map((row) => (
                <TR
                  key={row.incidentId}
                  className="cursor-pointer"
                  onClick={() => navigate(`/reports?incident=${row.incidentId}`)}
                >
                  <TD className="font-mono text-xs text-cyan">{row.incidentId}</TD>
                  <TD className="max-w-[360px] truncate">{row.subject}</TD>
                  <TD>
                    <RiskBadge level={row.riskLevel} />
                  </TD>
                  <TD className="font-mono">{row.riskScore}</TD>
                  <TD className="text-text-muted text-xs whitespace-nowrap">
                    {format(new Date(row.receivedAt), "MMM d, HH:mm")}
                  </TD>
                  <TD className="text-text-muted text-xs">{row.analyst}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
