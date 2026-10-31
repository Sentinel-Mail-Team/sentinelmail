/**
 * SentinelMail — Settings
 * -----------------------------------------------------------------------
 * Route:        "/settings"
 * Purpose:      Project information for presentation/viva purposes
 *               (problem statement, objective, tech stack, scope &
 *               limitations, team & guide) plus static platform
 *               configuration display.
 * Data source:  Static content — no dynamic data.
 * -----------------------------------------------------------------------
 */
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Bell,
  Database,
  GraduationCap,
  Target,
  Layers,
  AlertCircle,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

const platformRows = [
  { icon: ShieldCheck, title: "Threat intelligence feeds", description: "3 feeds connected · last synced 2 minutes ago" },
  { icon: Bell, title: "Alert notifications", description: "Critical and high risk incidents notify the SOC channel" },
  { icon: Database, title: "Retention policy", description: "Investigation data retained for 180 days" },
];

const techStack = [
  "React 19 + TypeScript",
  "Vite",
  "Tailwind CSS v4",
  "Recharts",
  "React Flow (@xyflow/react)",
  "postal-mime (client-side .eml parsing)",
  "zustand (session state)",
];

export function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-lg font-semibold text-text tracking-tight">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Platform configuration and project information</p>
      </div>

      {/* --- About This Project (for academic / viva presentation) --- */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-cyan" /> About This Project
            </CardTitle>
            <CardDescription>SentinelMail — AI-assisted email threat detection & forensic investigation platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <AboutBlock icon={Target} title="Problem Statement">
            Phishing and credential-theft emails often carry multiple detectable red flags — spoofed
            sender authentication, suspicious links, urgency-driven language — but analysts reviewing
            email manually can miss them, and the reasoning behind a verdict is rarely made explicit.
          </AboutBlock>

          <AboutBlock icon={Layers} title="Objective">
            Build a SOC-style dashboard that takes a raw <code className="font-mono text-cyan/90">.eml</code> file,
            extracts real indicators from its headers, links, and content, scores it with a transparent
            rule-based engine, and presents the full investigation trail — authentication results, threat
            intelligence, correlation with related incidents, and a forensic report — end to end.
          </AboutBlock>

          <AboutBlock icon={SettingsIcon} title="Tech Stack">
            <div className="flex flex-wrap gap-2 mt-1">
              {techStack.map((t) => (
                <span key={t} className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-mono text-text-muted">
                  {t}
                </span>
              ))}
            </div>
          </AboutBlock>

          <AboutBlock icon={AlertCircle} title="Current Scope & Limitations">
            <ul className="list-disc list-inside space-y-1 mt-1 text-text-muted">
              <li>Real .eml uploads are parsed and scored live by a weighted rule engine — see "How this score is calculated" on any Analysis Results page.</li>
              <li>No trained ML model or LLM is used for scoring; the AI Investigator uses templated, evidence-grounded answers, not a live model call.</li>
              <li>No live threat-intelligence feed (VirusTotal, URLhaus, WHOIS) is connected — reputations for real uploads are pattern-based and explicitly labeled as such.</li>
              <li>No backend/database — analyzed uploads persist only for the current browser session.</li>
            </ul>
          </AboutBlock>

          <AboutBlock icon={Users} title="Team & Guide">
            <div className="mt-1 space-y-1 text-text-muted">
              <p><span className="text-text-dim">Developed by:</span> <span className="italic">— add your name(s) here —</span></p>
              <p><span className="text-text-dim">Guided by:</span> <span className="italic">— add faculty guide's name here —</span></p>
              <p><span className="text-text-dim">Department / College:</span> <span className="italic">— add here —</span></p>
            </div>
          </AboutBlock>
        </CardContent>
      </Card>

      {/* --- Platform configuration (demo/static) --- */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2"><SettingsIcon className="h-4 w-4 text-cyan" /> Configuration</CardTitle>
            <CardDescription>Read-only for this demo build</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {platformRows.map((r) => (
            <div key={r.title} className="flex items-center gap-3 rounded-lg border border-border-soft bg-surface-2/50 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25 shrink-0">
                <r.icon className="h-4.5 w-4.5 text-cyan" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text">{r.title}</div>
                <div className="text-xs text-text-muted mt-0.5">{r.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function AboutBlock({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
        <Icon className="h-3.5 w-3.5 text-cyan" /> {title}
      </h3>
      <div className="text-sm text-text-muted mt-1.5 leading-relaxed">{children}</div>
    </div>
  );
}
