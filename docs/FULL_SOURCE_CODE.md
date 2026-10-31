# SentinelMail — Full Source Code Listing
Generated as a single-file reference for project documentation / viva. This mirrors the contents of `sentinelmail-mvp.zip` exactly.

## Project Structure

```
sentinelmail/
  index.html
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  src/
  App.tsx
    AiInvestigatorPanel.tsx
    CorrelationNode.tsx
    EmailSwitcher.tsx
    ScoringMethodology.tsx
      ThreatDistributionChart.tsx
      ThreatTrendChart.tsx
      AppLayout.tsx
      Sidebar.tsx
      Topbar.tsx
      Button.tsx
      Card.tsx
      RiskBadge.tsx
      ScoreDial.tsx
      StatTile.tsx
      Table.tsx
    mock.ts
    types.ts
  index.css
    analyzeEngine.ts
    emailParser.ts
    emails.ts
    risk.ts
    store.ts
    utils.ts
  main.tsx
    AnalysisResults.tsx
    AnalyzeEmail.tsx
    CorrelationGraphPage.tsx
    Dashboard.tsx
    History.tsx
    InvestigationTimeline.tsx
    Reports.tsx
    Settings.tsx
    ThreatIntelligence.tsx
```

---

## Configuration Files

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SentinelMail — Email Threat Detection & Forensics</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

### `package.json`

```json
{
  "name": "sentinelmail",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fontsource/inter": "^5.3.0",
    "@fontsource/jetbrains-mono": "^5.3.0",
    "@xyflow/react": "^12.11.6",
    "clsx": "^2.1.1",
    "date-fns": "^4.4.0",
    "lucide-react": "^1.39.0",
    "postal-mime": "^3.0.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.3",
    "recharts": "^3.10.1",
    "tailwind-merge": "^3.6.0",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "tailwindcss": "^4.3.3",
    "typescript": "~6.0.2",
    "vite": "^8.2.2"
  }
}

```

### `vite.config.ts`

```ts
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

```

### `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

```

### `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023", "DOM"],
    "module": "esnext",
    "types": ["vite/client"],
    "allowArbitraryExtensions": true,
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,

    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}

```

### `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "es2023",
    "lib": ["ES2023"],
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "module": "nodenext",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}

```

---

## Source Files (`src/`)

### `src/App.tsx`

```tsx
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { AnalyzeEmail } from "@/pages/AnalyzeEmail";
import { AnalysisResults } from "@/pages/AnalysisResults";
import { ThreatIntelligence } from "@/pages/ThreatIntelligence";
import { InvestigationTimeline } from "@/pages/InvestigationTimeline";
import { Reports } from "@/pages/Reports";
import { History } from "@/pages/History";
import { Settings } from "@/pages/Settings";

// React Flow (the correlation graph) pulls in a large dependency graph, so it's
// loaded on demand instead of bundled into the main chunk every page pays for.
const CorrelationGraphPage = lazy(() =>
  import("@/pages/CorrelationGraphPage").then((m) => ({ default: m.CorrelationGraphPage }))
);

function RouteLoading() {
  return <div className="text-sm text-text-muted px-1 py-8">Loading…</div>;
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<AnalyzeEmail />} />
        <Route path="/analysis/:emailId" element={<AnalysisResults />} />
        <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
        <Route
          path="/correlation"
          element={
            <Suspense fallback={<RouteLoading />}>
              <CorrelationGraphPage />
            </Suspense>
          }
        />
        <Route path="/timeline" element={<InvestigationTimeline />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;

```

### `src/components/AiInvestigatorPanel.tsx`

```tsx
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

```

### `src/components/CorrelationNode.tsx`

```tsx
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

```

### `src/components/EmailSwitcher.tsx`

```tsx
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

```

### `src/components/ScoringMethodology.tsx`

```tsx
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

```

### `src/components/charts/ThreatDistributionChart.tsx`

```tsx
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { threatDistribution } from "@/data/mock";

export function ThreatDistributionChart() {
  const total = threatDistribution.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        {/* Fixed pixel dimensions passed directly to PieChart (no ResponsiveContainer):
            ResponsiveContainer measures its parent via ResizeObserver on mount, which
            adds an async render pass. That's invisible on a fresh page load, but on an
            SPA route transition it can delay the first paint by ~1s while the container
            briefly reports zero size mid-transition. Since this chart's size is already
            fixed, skipping ResponsiveContainer avoids that delay entirely. */}
        <PieChart width={160} height={160}>
          <Pie
            data={threatDistribution}
            dataKey="value"
            nameKey="name"
            innerRadius={52}
            outerRadius={76}
            paddingAngle={2}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {threatDistribution.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#141b28", border: "1px solid #212a3a", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#e7ebf3", fontWeight: 600 }}
            formatter={(value, name) => [`${value} incidents`, name]}
          />
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-xl font-semibold text-text">{total}</span>
          <span className="text-[10px] text-text-dim">total</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2.5">
        {threatDistribution.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-text-muted">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
            <span className="font-mono text-text">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

```

### `src/components/charts/ThreatTrendChart.tsx`

```tsx
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { threatTrend } from "@/data/mock";

export function ThreatTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={threatTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillSafe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a2233" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: "#57617a", fontSize: 11 }} axisLine={{ stroke: "#212a3a" }} tickLine={false} />
        <YAxis tick={{ fill: "#57617a", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
        <Tooltip
          contentStyle={{ background: "#141b28", border: "1px solid #212a3a", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#e7ebf3", fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ padding: 0 }}
        />
        <Area type="monotone" dataKey="safe" name="Safe" stroke="#22d3ee" strokeWidth={2} fill="url(#fillSafe)" stackId="1" />
        <Area type="monotone" dataKey="medium" name="Medium risk" stroke="#f59e0b" strokeWidth={2} fill="url(#fillMedium)" stackId="1" />
        <Area type="monotone" dataKey="high" name="High risk" stroke="#ef4444" strokeWidth={2} fill="url(#fillHigh)" stackId="1" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

```

### `src/components/layout/AppLayout.tsx`

```tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

```

### `src/components/layout/Sidebar.tsx`

```tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScanSearch,
  Radar,
  Waypoints,
  History as HistoryIcon,
  FileText,
  Clock,
  Settings,
  ShieldHalf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/analyze", label: "Analyze Email", icon: ScanSearch },
  { to: "/threat-intelligence", label: "Threat Intelligence", icon: Radar },
  { to: "/correlation", label: "Correlation Graph", icon: Waypoints },
  { to: "/timeline", label: "Investigation Timeline", icon: Clock },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-cyan/10 border border-cyan/30">
          <ShieldHalf className="h-4.5 w-4.5 text-cyan" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-text tracking-tight">SentinelMail</div>
          <div className="text-[10px] text-text-dim font-mono">SOC CONSOLE</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-cyan/10 text-cyan border border-cyan/20"
                  : "text-text-muted hover:text-text hover:bg-surface-2 border border-transparent"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-[11px] text-text-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse-dot" />
          Threat feeds synced 2m ago
        </div>
      </div>
    </aside>
  );
}

```

### `src/components/layout/Topbar.tsx`

```tsx
import { Search, Bell, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
        <input
          type="text"
          placeholder="Search incidents, domains, IPs..."
          className="w-full rounded-md border border-border bg-surface-2 py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-dim focus:border-cyan/50 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-safe/30 bg-safe/10 px-3 py-1.5 text-xs font-medium text-safe">
          <span className="h-1.5 w-1.5 rounded-full bg-safe animate-pulse-dot" />
          System Operational
        </div>

        <button className="relative rounded-md p-2 text-text-muted hover:bg-surface-2 hover:text-text transition-colors" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-critical" />
        </button>

        <button className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 hover:bg-surface-2 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-dim/40 text-xs font-semibold text-cyan border border-cyan/30">
            AR
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-medium text-text">Aditi Rao</div>
            <div className="text-[10px] text-text-dim">SOC Analyst</div>
          </div>
          <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-text-dim" />
        </button>
      </div>
    </header>
  );
}

```

### `src/components/ui/Button.tsx`

```tsx
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-cyan text-[#04141a] hover:bg-cyan/90 font-medium",
  secondary: "bg-surface-3 text-text hover:bg-surface-3/70 border border-border",
  ghost: "text-text-muted hover:text-text hover:bg-surface-2",
  outline: "border border-border text-text hover:bg-surface-2",
  danger: "bg-critical/15 text-critical border border-critical/30 hover:bg-critical/25",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

```

### `src/components/ui/Card.tsx`

```tsx
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 px-5 pt-4 pb-3", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-[13px] font-semibold text-text tracking-tight", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-text-muted mt-0.5", className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

```

### `src/components/ui/RiskBadge.tsx`

```tsx
import type { RiskLevel } from "@/data/types";
import { riskConfig } from "@/lib/risk";
import { cn } from "@/lib/utils";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const c = riskConfig[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium font-mono uppercase tracking-wide",
        c.bg,
        c.text,
        c.border,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

export function AuthPill({ result }: { result: "PASS" | "FAIL" | "NEUTRAL" }) {
  const map = {
    PASS: "bg-safe/10 text-safe border-safe/30",
    FAIL: "bg-critical/10 text-critical border-critical/30",
    NEUTRAL: "bg-warning/10 text-warning border-warning/30",
  };
  return (
    <span className={cn("inline-flex items-center rounded border px-2.5 py-1 text-xs font-mono font-semibold tracking-wide", map[result])}>
      {result}
    </span>
  );
}

```

### `src/components/ui/ScoreDial.tsx`

```tsx
import { riskConfig, scoreToLevel } from "@/lib/risk";
import { cn } from "@/lib/utils";

export function ScoreDial({ score, size = 128 }: { score: number; size?: number }) {
  const level = scoreToLevel(score);
  const c = riskConfig[level];
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={8}
          className="stroke-border-soft"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(c.ring, "transition-[stroke-dashoffset] duration-700 ease-out")}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-3xl font-semibold text-text">{score}</span>
        <span className="text-[10px] text-text-dim">/ 100</span>
      </div>
    </div>
  );
}

```

### `src/components/ui/StatTile.tsx`

```tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "critical" | "warning" | "safe" | "cyan";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "text-text-muted bg-surface-3 border-border",
    critical: "text-critical bg-critical/10 border-critical/25",
    warning: "text-warning bg-warning/10 border-warning/25",
    safe: "text-safe bg-safe/10 border-safe/25",
    cyan: "text-cyan bg-cyan/10 border-cyan/25",
  };

  return (
    <div className="rounded-lg border border-border bg-surface px-5 py-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">{label}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-text">{value}</div>
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-md border shrink-0", toneClasses[tone])}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

```

### `src/components/ui/Table.tsx`

```tsx
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-border", className)} {...props} />;
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border-soft", className)} {...props} />;
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("hover:bg-surface-2/60 transition-colors", className)} {...props} />;
}

export function TH({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "text-left text-[11px] font-medium uppercase tracking-wide text-text-dim px-4 py-2.5 whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

export function TD({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3 text-text align-middle", className)} {...props} />;
}

```

### `src/data/mock.ts`

```ts
import type { Campaign, EmailRecord } from "./types";

export const dashboardStats = {
  emailsAnalyzed: 1284,
  threatsDetected: 347,
  highRiskIncidents: 86,
  suspiciousIps: 129,
  suspiciousDomains: 74,
  relatedCampaigns: 18,
};

export const threatTrend = [
  { day: "Aug 27", safe: 142, medium: 18, high: 6 },
  { day: "Aug 28", safe: 158, medium: 22, high: 9 },
  { day: "Aug 29", safe: 131, medium: 15, high: 4 },
  { day: "Aug 30", safe: 176, medium: 27, high: 11 },
  { day: "Aug 31", safe: 164, medium: 31, high: 14 },
  { day: "Sep 1", safe: 189, medium: 24, high: 8 },
  { day: "Sep 2", safe: 121, medium: 19, high: 13 },
];

export const threatDistribution = [
  { name: "Phishing", value: 168, color: "#ef4444" },
  { name: "Credential theft", value: 96, color: "#f59e0b" },
  { name: "Malware delivery", value: 41, color: "#3b82f6" },
  { name: "Spoofing", value: 27, color: "#22d3ee" },
  { name: "Other", value: 15, color: "#57617a" },
];

const phishingEmail: EmailRecord = {
  id: "EML-40921",
  incidentId: "INV-58231",
  subject: "Action Required: Verify Your Account to Avoid Suspension",
  from: "IT Security Team <security-alert@paypal-secure-verify.com>",
  fromDomain: "paypal-secure-verify.com",
  replyTo: "no-reply@acct-support-center.ru",
  to: "j.mehta@northbridge-logistics.com",
  receivedAt: "2026-09-02T09:41:00+05:30",
  riskScore: 91,
  riskLevel: "critical",
  threatType: "Phishing / Credential Theft",
  campaignId: "CMP-1187",
  bodyPreview:
    "We detected unusual sign-in activity on your account. To avoid a 24-hour suspension, confirm your identity immediately using the secure link below. Failure to verify may result in permanent account lock.",
  indicators: [
    { label: "Suspicious credential-harvesting URL", detected: true, detail: "Link routes through a look-alike login page hosted on a domain registered 6 days ago." },
    { label: "Sender / domain mismatch", detected: true, detail: "Display name references PayPal; sending domain is unrelated to any PayPal-owned infrastructure." },
    { label: "Urgent authentication request", detected: true, detail: "Message uses a 24-hour suspension deadline to pressure the recipient into acting without verification." },
    { label: "SPF failure", detected: true, detail: "Sending server is not authorized to send mail for the claimed domain." },
    { label: "DMARC failure", detected: true, detail: "Message fails domain alignment and would be rejected under an enforced DMARC policy." },
    { label: "Suspicious domain reputation", detected: true, detail: "Sending domain flagged by multiple threat feeds within the last 72 hours." },
    { label: "Related incidents detected", detected: true, detail: "Shares sending infrastructure with a second incident (EML-40944) from the same day." },
  ],
  auth: [
    { protocol: "SPF", result: "FAIL", detail: "185.220.101.47 is not listed in paypal-secure-verify.com's SPF record.", plainLanguage: "The server that sent this email was never approved to send mail on behalf of this domain — a strong sign the sender address was faked." },
    { protocol: "DKIM", result: "PASS", detail: "Signature valid for d=paypal-secure-verify.com.", plainLanguage: "The email's cryptographic signature matches, but that only proves it wasn't altered in transit — it says nothing about whether the sending domain is trustworthy, and this one was registered days ago." },
    { protocol: "DMARC", result: "FAIL", detail: "Policy p=reject; alignment failed on From: header.", plainLanguage: "The domain's own policy says messages like this should be rejected, meaning a properly enforcing mail server would have blocked it before it reached the inbox." },
  ],
  ips: [
    { ip: "185.220.101.47", approximateLocation: "Approximate IP infrastructure location: Bucharest, Romania", asn: "AS9009 (M247 Ltd)", reputation: "malicious", riskLevel: "critical", notes: "Associated with 14 prior phishing campaigns across three threat feeds." },
    { ip: "45.153.160.2", approximateLocation: "Approximate IP infrastructure location: Amsterdam, Netherlands", asn: "AS207137", reputation: "suspicious", riskLevel: "high", notes: "Hosting provider frequently abused for short-lived phishing kits." },
  ],
  domains: [
    { domain: "paypal-secure-verify.com", registered: "2026-08-27", registrar: "NiceNIC.NET", reputation: "malicious", riskLevel: "critical", notes: "Registered 6 days before this message was sent; uses privacy-proxy WHOIS." },
    { domain: "acct-support-center.ru", registered: "2026-07-14", registrar: "REGRU-RU", reputation: "suspicious", riskLevel: "high", notes: "Reply-to domain with no legitimate mail history prior to this campaign." },
  ],
  urls: [
    { url: "hxxps://paypal-secure-verify.com/login/confirm-identity", category: "Credential harvesting", reputation: "malicious", riskLevel: "critical", notes: "Clones the PayPal login page; form posts credentials to a third-party collection endpoint." },
    { url: "hxxps://bit.ly/3xVerify-Now", category: "URL shortener redirect", reputation: "suspicious", riskLevel: "high", notes: "Shortened link masks the true destination; resolves to the credential-harvesting page above." },
  ],
  timeline: [
    { time: "09:41", label: "Email received", detail: "Message ingested from mail gateway for j.mehta@northbridge-logistics.com.", status: "info" },
    { time: "09:41", label: "SPF authentication failed", detail: "Sending IP not authorized for claimed domain.", status: "critical" },
    { time: "09:42", label: "Suspicious URL extracted", detail: "2 URLs extracted and queued for reputation analysis.", status: "warning" },
    { time: "09:42", label: "IP reputation checked", detail: "185.220.101.47 matched against threat intelligence feeds.", status: "warning" },
    { time: "09:43", label: "Related incident found", detail: "Shared domain/IP infrastructure with EML-40944 detected.", status: "warning" },
    { time: "09:44", label: "Threat classified HIGH RISK", detail: "Composite risk score calculated at 91/100.", status: "critical" },
    { time: "09:45", label: "Investigation generated", detail: "Forensic report INV-58231 created and queued for analyst review.", status: "success" },
  ],
  aiQa: [
    {
      question: "Why is this email high risk?",
      answer: "This message scores 91/100 because it combines a failed sender authentication chain (SPF and DMARC both fail) with a credential-harvesting URL and a domain that was registered only six days ago. Any one of these would warrant a closer look; together they indicate a deliberate impersonation attempt rather than a misconfiguration.",
    },
    {
      question: "What indicators suggest phishing?",
      answer: "The display name impersonates a known brand while the underlying domain has no relationship to it, the message manufactures urgency with a 24-hour suspension deadline, and the primary link leads to a login page that visually mirrors the real service but submits credentials to an unrelated third-party server.",
    },
    {
      question: "Are there related incidents?",
      answer: "Yes. EML-40944, received the same afternoon, shares both the sending domain and the originating IP address with this message. Both have been grouped under campaign CMP-1187 with an 87% correlation confidence.",
    },
    {
      question: "Which authentication checks failed?",
      answer: "SPF and DMARC both failed. DKIM passed, but a passing signature only confirms the message wasn't altered after signing — it does not vouch for the sending domain's legitimacy, which is why the SPF and DMARC failures are the more meaningful signal here.",
    },
    {
      question: "What should an analyst investigate next?",
      answer: "Confirm whether the recipient interacted with the link or submitted credentials, check the mailbox for forwarding-rule changes, search the mail gateway logs for other recipients of messages from the same sending IP, and consider blocking the domain and IP at the perimeter if not already actioned.",
    },
  ],
  attachments: [],
};

const credentialTheftEmail: EmailRecord = {
  id: "EML-40944",
  incidentId: "INV-58239",
  subject: "Your Document Has Been Shared — Review Required",
  from: "Document Center <no-reply@paypal-secure-verify.com>",
  fromDomain: "paypal-secure-verify.com",
  to: "r.acharya@northbridge-logistics.com",
  receivedAt: "2026-09-02T14:07:00+05:30",
  riskScore: 88,
  riskLevel: "critical",
  threatType: "Credential Theft",
  campaignId: "CMP-1187",
  bodyPreview:
    "A secure document has been shared with you via the corporate file portal. Sign in with your work email to view the file before the sharing link expires.",
  indicators: [
    { label: "Suspicious credential-harvesting URL", detected: true, detail: "Link leads to a fake single sign-on page requesting corporate credentials." },
    { label: "Sender / domain mismatch", detected: true, detail: "Claims to be an internal document portal but originates from an external, unrelated domain." },
    { label: "Urgent authentication request", detected: true, detail: "Message implies the sharing link will expire to discourage careful review." },
    { label: "SPF failure", detected: true, detail: "Sending server not authorized for the claimed domain." },
    { label: "DMARC failure", detected: true, detail: "Fails domain alignment under an enforced reject policy." },
    { label: "Suspicious domain reputation", detected: true, detail: "Same domain reputation flag as the linked phishing incident." },
    { label: "Related incidents detected", detected: true, detail: "Shares sending domain and IP with EML-40921." },
  ],
  auth: [
    { protocol: "SPF", result: "FAIL", detail: "185.220.101.47 is not listed in paypal-secure-verify.com's SPF record.", plainLanguage: "Same unauthorized sending server as the related incident — the sender address is spoofed." },
    { protocol: "DKIM", result: "PASS", detail: "Signature valid for d=paypal-secure-verify.com.", plainLanguage: "The signature matches, but the domain itself is the same recently registered domain seen in the related phishing message." },
    { protocol: "DMARC", result: "FAIL", detail: "Policy p=reject; alignment failed on From: header.", plainLanguage: "The domain's policy calls for rejection, so a properly configured mail server would not have delivered this." },
  ],
  ips: [
    { ip: "185.220.101.47", approximateLocation: "Approximate IP infrastructure location: Bucharest, Romania", asn: "AS9009 (M247 Ltd)", reputation: "malicious", riskLevel: "critical", notes: "Same infrastructure used in EML-40921, sent five hours earlier." },
  ],
  domains: [
    { domain: "paypal-secure-verify.com", registered: "2026-08-27", registrar: "NiceNIC.NET", reputation: "malicious", riskLevel: "critical", notes: "Reused across both messages in this campaign." },
  ],
  urls: [
    { url: "hxxps://paypal-secure-verify.com/portal/sso-review", category: "Credential harvesting", reputation: "malicious", riskLevel: "critical", notes: "Fake single sign-on form; harvested credentials match the pattern from the related incident." },
  ],
  timeline: [
    { time: "14:07", label: "Email received", detail: "Message ingested from mail gateway for r.acharya@northbridge-logistics.com.", status: "info" },
    { time: "14:07", label: "SPF authentication failed", detail: "Sending IP not authorized for claimed domain.", status: "critical" },
    { time: "14:08", label: "Suspicious URL extracted", detail: "1 URL extracted and queued for reputation analysis.", status: "warning" },
    { time: "14:08", label: "IP reputation checked", detail: "185.220.101.47 matched prior campaign infrastructure.", status: "warning" },
    { time: "14:09", label: "Related incident found", detail: "Correlated with EML-40921 via shared domain and IP.", status: "warning" },
    { time: "14:10", label: "Threat classified HIGH RISK", detail: "Composite risk score calculated at 88/100.", status: "critical" },
    { time: "14:11", label: "Investigation generated", detail: "Forensic report INV-58239 created and queued for analyst review.", status: "success" },
  ],
  aiQa: [
    {
      question: "Why is this email high risk?",
      answer: "It scores 88/100 due to failed SPF and DMARC checks, a fake single sign-on page requesting corporate credentials, and reuse of the exact sending domain and IP seen in the related phishing incident from the same day.",
    },
    {
      question: "What indicators suggest phishing?",
      answer: "The message impersonates an internal document-sharing portal while originating from an external domain, creates urgency around a link expiring, and directs the recipient to a login page designed to capture their work credentials.",
    },
    {
      question: "Are there related incidents?",
      answer: "Yes — this message shares its sending domain and IP address with EML-40921, sent roughly five hours earlier to a different recipient at the same organization. Both are grouped under campaign CMP-1187.",
    },
    {
      question: "Which authentication checks failed?",
      answer: "SPF and DMARC both failed, matching the pattern seen in the related incident. DKIM passed but does not offset the domain-level failures.",
    },
    {
      question: "What should an analyst investigate next?",
      answer: "Check whether either recipient submitted credentials, force a password reset for both mailboxes as a precaution, review sign-in logs for anomalous access, and confirm the malicious domain and IP are blocked organization-wide.",
    },
  ],
  attachments: [],
};

const legitimateEmail: EmailRecord = {
  id: "EML-40958",
  incidentId: "INV-58244",
  subject: "Q3 Logistics Review — Meeting Notes Attached",
  from: "Priya Nair <priya.nair@northbridge-logistics.com>",
  fromDomain: "northbridge-logistics.com",
  to: "team-ops@northbridge-logistics.com",
  receivedAt: "2026-09-02T11:20:00+05:30",
  riskScore: 4,
  riskLevel: "safe",
  threatType: "None",
  bodyPreview:
    "Sharing notes from this morning's Q3 review. Action items are highlighted at the bottom — let me know if I've missed anything before Friday's follow-up.",
  indicators: [
    { label: "Suspicious credential-harvesting URL", detected: false, detail: "No credential-related links present in the message body." },
    { label: "Sender / domain mismatch", detected: false, detail: "Sending domain matches the organization's verified mail infrastructure." },
    { label: "Urgent authentication request", detected: false, detail: "No urgency or account-verification language detected." },
    { label: "SPF failure", detected: false, detail: "Sending server is listed in the organization's SPF record." },
    { label: "DMARC failure", detected: false, detail: "Passes domain alignment under the organization's DMARC policy." },
    { label: "Suspicious domain reputation", detected: false, detail: "Domain has an established, clean sending history." },
    { label: "Related incidents detected", detected: false, detail: "No correlation with any open campaign." },
  ],
  auth: [
    { protocol: "SPF", result: "PASS", detail: "10.44.2.18 is listed in northbridge-logistics.com's SPF record.", plainLanguage: "The sending server is on the organization's approved list — the sender address is legitimate." },
    { protocol: "DKIM", result: "PASS", detail: "Signature valid for d=northbridge-logistics.com.", plainLanguage: "The message content matches what was signed and hasn't been tampered with in transit." },
    { protocol: "DMARC", result: "PASS", detail: "Policy p=reject; alignment passed on From: header.", plainLanguage: "The message fully aligns with the domain's own authentication policy — a clean result across the board." },
  ],
  ips: [
    { ip: "10.44.2.18", approximateLocation: "Approximate IP infrastructure location: Hyderabad, India", asn: "AS45194 (Corporate mail relay)", reputation: "clean", riskLevel: "safe", notes: "Internal corporate mail relay with consistent sending history." },
  ],
  domains: [
    { domain: "northbridge-logistics.com", registered: "2014-03-02", registrar: "GoDaddy.com, LLC", reputation: "clean", riskLevel: "safe", notes: "Organization's own primary domain, registered over a decade ago." },
  ],
  urls: [],
  timeline: [
    { time: "11:20", label: "Email received", detail: "Message ingested from mail gateway for team-ops@northbridge-logistics.com.", status: "info" },
    { time: "11:20", label: "Authentication checks passed", detail: "SPF, DKIM, and DMARC all passed.", status: "success" },
    { time: "11:20", label: "No indicators detected", detail: "Content and link analysis found no threat indicators.", status: "success" },
    { time: "11:21", label: "Classified SAFE", detail: "Composite risk score calculated at 4/100.", status: "success" },
  ],
  aiQa: [
    {
      question: "Why is this email high risk?",
      answer: "It isn't — this message scores 4/100. All three authentication checks pass, the sending domain is the organization's own verified infrastructure, and no phishing indicators were detected in the content or links.",
    },
    {
      question: "What indicators suggest phishing?",
      answer: "None were found. There is no sender impersonation, no urgency language, and no credential-harvesting links in this message.",
    },
    {
      question: "Are there related incidents?",
      answer: "No. This message has no correlation with any open campaign or flagged infrastructure.",
    },
    {
      question: "Which authentication checks failed?",
      answer: "None — SPF, DKIM, and DMARC all passed, which is consistent with mail sent from the organization's own domain.",
    },
    {
      question: "What should an analyst investigate next?",
      answer: "No further action is needed. This message can remain classified as safe.",
    },
  ],
  attachments: [{ name: "Q3-review-notes.pdf", type: "application/pdf", verdict: "safe" }],
};

export const emails: EmailRecord[] = [phishingEmail, credentialTheftEmail, legitimateEmail];

export const campaign: Campaign = {
  id: "CMP-1187",
  name: "PayPal Impersonation — Credential Harvesting Wave",
  relatedIncidents: 3,
  confidence: 87,
  sharedDomain: "paypal-secure-verify.com",
  sharedIp: "185.220.101.47",
  emailIds: [phishingEmail.id, credentialTheftEmail.id],
};

export const recentInvestigations = [
  { incidentId: phishingEmail.incidentId, subject: phishingEmail.subject, riskLevel: phishingEmail.riskLevel, riskScore: phishingEmail.riskScore, receivedAt: phishingEmail.receivedAt, analyst: "Unassigned" },
  { incidentId: credentialTheftEmail.incidentId, subject: credentialTheftEmail.subject, riskLevel: credentialTheftEmail.riskLevel, riskScore: credentialTheftEmail.riskScore, receivedAt: credentialTheftEmail.receivedAt, analyst: "Unassigned" },
  { incidentId: legitimateEmail.incidentId, subject: legitimateEmail.subject, riskLevel: legitimateEmail.riskLevel, riskScore: legitimateEmail.riskScore, receivedAt: legitimateEmail.receivedAt, analyst: "Auto-cleared" },
  { incidentId: "INV-58198", subject: "Invoice #4471 Overdue — Immediate Payment Needed", riskLevel: "high" as const, riskScore: 79, receivedAt: "2026-09-01T16:32:00+05:30", analyst: "A. Fernandes" },
  { incidentId: "INV-58177", subject: "Your Mailbox Storage Is Almost Full", riskLevel: "medium" as const, riskScore: 54, receivedAt: "2026-09-01T10:05:00+05:30", analyst: "A. Fernandes" },
];

export const historyRecords = [
  ...recentInvestigations,
  { incidentId: "INV-58160", subject: "Wire Transfer Confirmation Needed — Urgent", riskLevel: "critical" as const, riskScore: 94, receivedAt: "2026-08-31T09:14:00+05:30", analyst: "S. Rao" },
  { incidentId: "INV-58142", subject: "New Voicemail Message Received", riskLevel: "low" as const, riskScore: 22, receivedAt: "2026-08-30T13:47:00+05:30", analyst: "Auto-cleared" },
  { incidentId: "INV-58121", subject: "Weekly Team Standup Notes", riskLevel: "safe" as const, riskScore: 2, receivedAt: "2026-08-30T09:02:00+05:30", analyst: "Auto-cleared" },
  { incidentId: "INV-58098", subject: "Password Expiry Notice — Reset Within 24 Hours", riskLevel: "high" as const, riskScore: 83, receivedAt: "2026-08-29T15:51:00+05:30", analyst: "S. Rao" },
];

export function getEmailById(id: string) {
  return emails.find((e) => e.id === id);
}

```

### `src/data/types.ts`

```ts
export type RiskLevel = "safe" | "low" | "medium" | "high" | "critical";

export type AuthResult = "PASS" | "FAIL" | "NEUTRAL";

export interface AuthenticationCheck {
  protocol: "SPF" | "DKIM" | "DMARC";
  result: AuthResult;
  detail: string;
  plainLanguage: string;
}

export interface Indicator {
  label: string;
  detected: boolean;
  detail: string;
}

export interface IpIntel {
  ip: string;
  approximateLocation: string;
  asn: string;
  reputation: "malicious" | "suspicious" | "unknown" | "clean";
  riskLevel: RiskLevel;
  notes: string;
}

export interface DomainIntel {
  domain: string;
  registered: string;
  registrar: string;
  reputation: "malicious" | "suspicious" | "unknown" | "clean";
  riskLevel: RiskLevel;
  notes: string;
}

export interface UrlIntel {
  url: string;
  category: string;
  reputation: "malicious" | "suspicious" | "unknown" | "clean";
  riskLevel: RiskLevel;
  notes: string;
}

export interface TimelineEvent {
  time: string;
  label: string;
  detail: string;
  status: "info" | "warning" | "critical" | "success";
}

export interface AiQaPair {
  question: string;
  answer: string;
}

export interface EmailRecord {
  id: string;
  incidentId: string;
  subject: string;
  from: string;
  fromDomain: string;
  replyTo?: string;
  to: string;
  receivedAt: string;
  riskScore: number;
  riskLevel: RiskLevel;
  threatType: string;
  campaignId?: string;
  bodyPreview: string;
  indicators: Indicator[];
  auth: AuthenticationCheck[];
  ips: IpIntel[];
  domains: DomainIntel[];
  urls: UrlIntel[];
  timeline: TimelineEvent[];
  aiQa: AiQaPair[];
  attachments: { name: string; type: string; verdict: RiskLevel }[];
}

export interface Campaign {
  id: string;
  name: string;
  relatedIncidents: number;
  confidence: number;
  sharedDomain: string;
  sharedIp: string;
  emailIds: string[];
}

```

### `src/index.css`

```css
@import "tailwindcss";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";
@import "@fontsource/jetbrains-mono/600.css";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;

  --color-base: #090c12;
  --color-surface: #0e131c;
  --color-surface-2: #141b28;
  --color-surface-3: #1a2233;
  --color-border: #212a3a;
  --color-border-soft: #1a2130;

  --color-text: #e7ebf3;
  --color-text-muted: #8892a3;
  --color-text-dim: #57617a;

  --color-cyan: #22d3ee;
  --color-cyan-dim: #0e7490;
  --color-blue: #3b82f6;

  --color-critical: #ef4444;
  --color-critical-dim: #7f1d1d;
  --color-warning: #f59e0b;
  --color-warning-dim: #78350f;
  --color-safe: #22c55e;
  --color-safe-dim: #14532d;

  --animate-scan: scan 2.4s linear infinite;
  --animate-pulse-dot: pulse-dot 2s ease-in-out infinite;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

html, body, #root {
  height: 100%;
}

body {
  background-color: var(--color-base);
  color: var(--color-text);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

* {
  border-color: var(--color-border);
}

::selection {
  background: var(--color-cyan);
  color: #04141a;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-surface-3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-border);
}

:focus-visible {
  outline: 2px solid var(--color-cyan);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}

```

### `src/lib/analyzeEngine.ts`

```ts
/**
 * SentinelMail — Rule-Based Analysis Engine
 * -----------------------------------------------------------------------
 * This is the actual "detection algorithm" behind every real .eml
 * upload. It is a transparent, weighted rule engine — NOT a trained
 * ML model and NOT an LLM. Each check below inspects real parsed
 * email data (headers, links, content) and adds points to a running
 * score, which is then mapped to a risk level (see `scoreToLevel` in
 * `src/lib/risk.ts`).
 *
 * See also: `src/components/ScoringMethodology.tsx`, which renders
 * this same rule table in the UI on every Analysis Results page.
 * -----------------------------------------------------------------------
 */
import type {
  AiQaPair,
  AuthenticationCheck,
  DomainIntel,
  EmailRecord,
  Indicator,
  IpIntel,
  TimelineEvent,
  UrlIntel,
} from "@/data/types";
import { scoreToLevel } from "@/lib/risk";
import type { ParsedEmail } from "@/lib/emailParser";

const URGENCY_WORDS = [
  "urgent", "immediately", "suspend", "suspended", "verify your account", "verify now",
  "confirm your identity", "act now", "24 hours", "expire", "expires", "expiring",
  "unusual activity", "unauthorized", "final notice", "action required", "restricted",
];

const BRAND_KEYWORDS = [
  "paypal", "microsoft", "apple", "amazon", "google", "netflix", "bank", "chase",
  "wellsfargo", "hdfc", "icici", "sbi", "dhl", "fedex", "linkedin", "facebook", "instagram",
];

const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly"];
const SUSPICIOUS_PATH_WORDS = ["login", "verify", "secure", "account", "confirm", "update", "signin", "sso"];
const RISKY_ATTACHMENT_EXT = [".exe", ".scr", ".js", ".vbs", ".bat", ".jar", ".cmd", ".ps1"];

const NO_LIVE_FEED_NOTE =
  "Live threat-intelligence lookup (e.g. VirusTotal, URLhaus) is not connected in this demo — this reputation is inferred from message patterns only, not a real-time feed.";

function extractUrls(text: string, html: string): string[] {
  const urlRegex = /https?:\/\/[^\s"'<>)]+/gi;
  const found = new Set<string>();
  for (const m of `${text}\n${html}`.matchAll(urlRegex)) {
    found.add(m[0].replace(/[.,;]+$/, ""));
  }
  return Array.from(found).slice(0, 8);
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function extractOriginatingIp(receivedHeaders: string[]): string | null {
  const ipRegex = /\[?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]?/;
  const isPrivate = (ip: string) =>
    /^10\./.test(ip) || /^192\.168\./.test(ip) || /^127\./.test(ip) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip);
  for (const header of receivedHeaders) {
    const match = header.match(ipRegex);
    if (match && !isPrivate(match[1])) return match[1];
  }
  return null;
}

function parseAuthResults(header: string | null): { spf: "PASS" | "FAIL" | "NEUTRAL"; dkim: "PASS" | "FAIL" | "NEUTRAL"; dmarc: "PASS" | "FAIL" | "NEUTRAL" } {
  const read = (key: string): "PASS" | "FAIL" | "NEUTRAL" => {
    if (!header) return "NEUTRAL";
    const m = header.match(new RegExp(`${key}=(pass|fail|softfail|neutral|none)`, "i"));
    if (!m) return "NEUTRAL";
    const v = m[1].toLowerCase();
    if (v === "pass") return "PASS";
    if (v === "fail" || v === "softfail") return "FAIL";
    return "NEUTRAL";
  };
  return { spf: read("spf"), dkim: read("dkim"), dmarc: read("dmarc") };
}

export function analyzeParsedEmail(parsed: ParsedEmail): EmailRecord {
  const now = new Date();
  const suffix = now.getTime().toString(36).toUpperCase().slice(-5);
  const id = `EML-U${suffix}`;
  const incidentId = `INV-U${suffix}`;

  const fromDomain = parsed.fromAddress.split("@")[1] ?? "unknown";
  const replyToDomain = parsed.replyToAddress ? parsed.replyToAddress.split("@")[1] : null;
  const bodyText = `${parsed.subject}\n${parsed.text}\n${parsed.html}`.toLowerCase();

  const indicators: Indicator[] = [];
  let score = 4; // baseline for a clean message

  // --- Urgency / social engineering language ---
  const matchedUrgency = URGENCY_WORDS.filter((w) => bodyText.includes(w));
  if (matchedUrgency.length > 0) {
    indicators.push({
      label: "Urgency / pressure language detected",
      detected: true,
      detail: `Message contains pressure language commonly used in social engineering: "${matchedUrgency.slice(0, 3).join('", "')}".`,
    });
    score += Math.min(20, matchedUrgency.length * 8);
  } else {
    indicators.push({
      label: "Urgency / pressure language detected",
      detected: false,
      detail: "No urgency or deadline-style pressure language found in the subject or body.",
    });
  }

  // --- Brand impersonation ---
  const mentionedBrand = BRAND_KEYWORDS.find(
    (b) => parsed.fromName.toLowerCase().includes(b) || bodyText.includes(b)
  );
  const brandMismatch = mentionedBrand && !fromDomain.toLowerCase().includes(mentionedBrand);
  if (brandMismatch) {
    indicators.push({
      label: "Sender / brand domain mismatch",
      detected: true,
      detail: `Message references "${mentionedBrand}" but the sending domain (${fromDomain}) has no relationship to that brand's known infrastructure.`,
    });
    score += 25;
  } else {
    indicators.push({
      label: "Sender / brand domain mismatch",
      detected: false,
      detail: "No brand name was found that conflicts with the sending domain.",
    });
  }

  // --- Reply-to mismatch ---
  if (replyToDomain && replyToDomain !== fromDomain) {
    indicators.push({
      label: "Reply-To domain differs from sender",
      detected: true,
      detail: `Reply-To (${replyToDomain}) does not match the From domain (${fromDomain}) — replies would be routed elsewhere.`,
    });
    score += 12;
  }

  // --- URLs ---
  const urls = extractUrls(parsed.text, parsed.html);
  const urlIntel: UrlIntel[] = [];
  let anySuspiciousUrl = false;
  for (const url of urls) {
    const domain = domainOf(url);
    const isShortener = SHORTENERS.some((s) => domain.includes(s));
    const hasSuspiciousPath = SUSPICIOUS_PATH_WORDS.some((w) => url.toLowerCase().includes(w));
    const isIpUrl = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain);
    const flagged = isShortener || hasSuspiciousPath || isIpUrl;
    if (flagged) anySuspiciousUrl = true;
    urlIntel.push({
      url,
      category: isIpUrl ? "IP-literal link" : isShortener ? "URL shortener redirect" : hasSuspiciousPath ? "Login / credential-style path" : "General link",
      reputation: flagged ? "suspicious" : "unknown",
      riskLevel: flagged ? "high" : "low",
      notes: NO_LIVE_FEED_NOTE,
    });
  }
  if (urls.length > 0) {
    indicators.push({
      label: "Suspicious link patterns",
      detected: anySuspiciousUrl,
      detail: anySuspiciousUrl
        ? `${urlIntel.filter((u) => u.reputation === "suspicious").length} of ${urls.length} extracted link(s) match shortener, IP-literal, or credential-style path patterns.`
        : `${urls.length} link(s) extracted; none matched known suspicious URL patterns (this is a pattern check only, not a live reputation lookup).`,
    });
    if (anySuspiciousUrl) score += 22;
  }

  // --- Authentication ---
  const authVerdicts = parseAuthResults(parsed.authResultsHeader);
  const auth: AuthenticationCheck[] = (["spf", "dkim", "dmarc"] as const).map((protocol) => {
    const result = authVerdicts[protocol];
    const upper = protocol.toUpperCase() as "SPF" | "DKIM" | "DMARC";
    const plainLanguage =
      result === "FAIL"
        ? `${upper} failed for this message — a strong signal the sending server was not authorized to send on behalf of this domain.`
        : result === "PASS"
        ? `${upper} passed — this check aligns with what the domain owner has authorized.`
        : `No ${upper} result was present in this message's headers, so this could not be verified from the raw file alone.`;
    return {
      protocol: upper,
      result,
      detail: parsed.authResultsHeader
        ? parsed.authResultsHeader.slice(0, 160)
        : "No Authentication-Results header found in this message.",
      plainLanguage,
    };
  });
  for (const a of auth) {
    if (a.result === "FAIL") {
      indicators.push({ label: `${a.protocol} failure`, detected: true, detail: a.plainLanguage });
      score += 18;
    }
  }

  // --- Attachments ---
  const riskyAttachments = parsed.attachments.filter((a) =>
    RISKY_ATTACHMENT_EXT.some((ext) => a.filename.toLowerCase().endsWith(ext))
  );
  if (parsed.attachments.length > 0) {
    indicators.push({
      label: "Risky attachment type",
      detected: riskyAttachments.length > 0,
      detail:
        riskyAttachments.length > 0
          ? `${riskyAttachments.length} attachment(s) use executable-style extensions (${riskyAttachments.map((a) => a.filename).join(", ")}).`
          : `${parsed.attachments.length} attachment(s) present; none use commonly-abused executable extensions.`,
    });
    if (riskyAttachments.length > 0) score += 20;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const riskLevel = scoreToLevel(score);

  const threatType =
    riskLevel === "safe" || riskLevel === "low"
      ? "None"
      : anySuspiciousUrl && (authVerdicts.spf === "FAIL" || authVerdicts.dmarc === "FAIL")
      ? "Phishing / Credential Theft"
      : riskyAttachments.length > 0
      ? "Possible Malware Delivery"
      : brandMismatch
      ? "Brand Impersonation"
      : "Suspicious / Social Engineering";

  // --- Domains ---
  const domains: DomainIntel[] = [
    {
      domain: fromDomain,
      registered: "Unknown (WHOIS lookup not connected)",
      registrar: "Unknown",
      reputation: brandMismatch || authVerdicts.spf === "FAIL" ? "suspicious" : "unknown",
      riskLevel: brandMismatch || authVerdicts.spf === "FAIL" ? "high" : "low",
      notes: NO_LIVE_FEED_NOTE,
    },
  ];
  if (replyToDomain && replyToDomain !== fromDomain) {
    domains.push({
      domain: replyToDomain,
      registered: "Unknown (WHOIS lookup not connected)",
      registrar: "Unknown",
      reputation: "unknown",
      riskLevel: "medium",
      notes: NO_LIVE_FEED_NOTE,
    });
  }

  // --- IPs ---
  const originatingIp = extractOriginatingIp(parsed.receivedHeaders);
  const ips: IpIntel[] = originatingIp
    ? [
        {
          ip: originatingIp,
          approximateLocation: "Approximate IP infrastructure location: unavailable (no live geolocation feed connected)",
          asn: "Unknown (ASN lookup not connected)",
          reputation: "unknown",
          riskLevel: "medium",
          notes: `Extracted from this message's Received headers. ${NO_LIVE_FEED_NOTE}`,
        },
      ]
    : [];

  // --- Timeline ---
  const t0 = now;
  const stamp = (offsetMs: number) => {
    const d = new Date(t0.getTime() + offsetMs);
    return d.toISOString().slice(11, 16);
  };
  const timeline: TimelineEvent[] = [
    { time: stamp(0), label: "Email received", detail: "Message parsed from uploaded .eml file.", status: "info" },
    {
      time: stamp(400),
      label: parsed.authResultsHeader ? "Authentication headers parsed" : "No authentication headers found",
      detail: parsed.authResultsHeader
        ? "SPF, DKIM, and DMARC results extracted from Authentication-Results header."
        : "Message did not include an Authentication-Results header.",
      status: authVerdicts.spf === "FAIL" || authVerdicts.dmarc === "FAIL" ? "critical" : "info",
    },
    {
      time: stamp(800),
      label: `${urls.length} link(s) extracted`,
      detail: anySuspiciousUrl ? "One or more links matched suspicious URL patterns." : "Links extracted and pattern-checked.",
      status: anySuspiciousUrl ? "warning" : "info",
    },
    {
      time: stamp(1200),
      label: `Threat classified ${riskLevel.toUpperCase()}`,
      detail: `Composite risk score calculated at ${score}/100 from rule-based indicators.`,
      status: riskLevel === "critical" || riskLevel === "high" ? "critical" : riskLevel === "medium" ? "warning" : "success",
    },
    { time: stamp(1500), label: "Investigation generated", detail: `Report ${incidentId} created.`, status: "success" },
  ];

  // --- AI Investigator (templated from real findings, not a live LLM call) ---
  const detectedLabels = indicators.filter((i) => i.detected).map((i) => i.label);
  const aiQa: AiQaPair[] = [
    {
      question: "Why is this email high risk?",
      answer:
        detectedLabels.length > 0
          ? `This message scores ${score}/100 based on ${detectedLabels.length} triggered indicator(s): ${detectedLabels.join(", ")}. Each was detected directly from the uploaded message's headers, links, or content.`
          : `This message scores ${score}/100. No high-risk indicators were triggered by the rule-based checks run against it.`,
    },
    {
      question: "What indicators suggest phishing?",
      answer:
        detectedLabels.length > 0
          ? `The triggered indicators are: ${detectedLabels.join("; ")}.`
          : "No phishing-style indicators were detected in this message.",
    },
    {
      question: "Are there related incidents?",
      answer: "This uploaded message has not been correlated against other incidents — correlation in this demo only runs across the built-in sample campaign.",
    },
    {
      question: "Which authentication checks failed?",
      answer: auth.some((a) => a.result === "FAIL")
        ? `${auth.filter((a) => a.result === "FAIL").map((a) => a.protocol).join(" and ")} failed. ${auth.find((a) => a.result === "FAIL")?.plainLanguage ?? ""}`
        : parsed.authResultsHeader
        ? "None of SPF, DKIM, or DMARC failed based on the headers present in this message."
        : "This message had no Authentication-Results header, so authentication could not be verified from the file alone.",
    },
    {
      question: "What should an analyst investigate next?",
      answer:
        riskLevel === "critical" || riskLevel === "high"
          ? "Confirm whether the recipient interacted with any extracted links, check mailbox rules for tampering, and consider blocking the sending domain pending further review."
          : "No further action appears necessary based on the indicators checked, but manual review is always reasonable for messages requesting sensitive action.",
    },
  ];

  return {
    id,
    incidentId,
    subject: parsed.subject,
    from: `${parsed.fromName} <${parsed.fromAddress}>`,
    fromDomain,
    replyTo: parsed.replyToAddress ?? undefined,
    to: parsed.toAddress,
    receivedAt: parsed.date ?? now.toISOString(),
    riskScore: score,
    riskLevel,
    threatType,
    bodyPreview: (parsed.text || parsed.html.replace(/<[^>]+>/g, " ")).slice(0, 240).trim() || "(no readable body content)",
    indicators,
    auth,
    ips,
    domains,
    urls: urlIntel,
    timeline,
    aiQa,
    attachments: parsed.attachments.map((a) => ({
      name: a.filename,
      type: a.mimeType,
      verdict: RISKY_ATTACHMENT_EXT.some((ext) => a.filename.toLowerCase().endsWith(ext)) ? "high" : "safe",
    })),
  };
}

```

### `src/lib/emailParser.ts`

```ts
import PostalMime from "postal-mime";

export interface ParsedEmail {
  subject: string;
  fromName: string;
  fromAddress: string;
  toAddress: string;
  replyToAddress: string | null;
  date: string | null;
  text: string;
  html: string;
  rawHeaders: { key: string; value: string }[];
  authResultsHeader: string | null;
  receivedHeaders: string[];
  attachments: { filename: string; mimeType: string; size: number }[];
}

export async function parseEmailFile(file: File): Promise<ParsedEmail> {
  const buffer = await file.arrayBuffer();
  const parser = new PostalMime();
  const parsed = await parser.parse(buffer);

  const rawHeaders = (parsed.headers ?? []).map((h) => ({ key: h.key, value: h.value }));
  const authResultsHeader =
    rawHeaders.find((h) => h.key.toLowerCase() === "authentication-results")?.value ?? null;
  const receivedHeaders = rawHeaders.filter((h) => h.key.toLowerCase() === "received").map((h) => h.value);

  const fromAddress = parsed.from?.address ?? "unknown@unknown";
  const replyTo = parsed.replyTo?.[0]?.address ?? null;

  return {
    subject: parsed.subject ?? "(no subject)",
    fromName: parsed.from?.name || fromAddress,
    fromAddress,
    toAddress: parsed.to?.[0]?.address ?? "unknown-recipient",
    replyToAddress: replyTo,
    date: parsed.date ?? null,
    text: parsed.text ?? "",
    html: parsed.html ?? "",
    rawHeaders,
    authResultsHeader,
    receivedHeaders,
    attachments: (parsed.attachments ?? []).map((a) => ({
      filename: a.filename ?? "unnamed-attachment",
      mimeType: a.mimeType ?? "application/octet-stream",
      size: typeof a.content === "string" ? a.content.length : a.content?.byteLength ?? 0,
    })),
  };
}

```

### `src/lib/emails.ts`

```ts
import { useMemo } from "react";
import { emails as demoEmails, recentInvestigations as demoRecent, historyRecords as demoHistory } from "@/data/mock";
import { useAnalysisStore } from "@/lib/store";
import type { EmailRecord } from "@/data/types";

function useUploadedList(): EmailRecord[] {
  const records = useAnalysisStore((s) => s.records);
  // records (the store's raw map) only changes reference when add() is called,
  // so this only recomputes when a new email is actually analyzed.
  return useMemo(
    () => Object.values(records).sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1)),
    [records]
  );
}

/** All emails: static demo set + anything the user has actually uploaded and analyzed this session. */
export function useAllEmails(): EmailRecord[] {
  const uploaded = useUploadedList();
  return useMemo(() => [...uploaded, ...demoEmails], [uploaded]);
}

export function useEmailById(id: string | undefined): EmailRecord | undefined {
  const records = useAnalysisStore((s) => s.records);
  if (!id) return undefined;
  return records[id] ?? demoEmails.find((e) => e.id === id);
}

export function useEmailByIncidentId(incidentId: string | undefined): EmailRecord | undefined {
  const uploaded = useUploadedList();
  if (!incidentId) return undefined;
  return (
    uploaded.find((e) => e.incidentId === incidentId) ??
    demoEmails.find((e) => e.incidentId === incidentId)
  );
}

function toRow(e: EmailRecord, analyst: string) {
  return {
    incidentId: e.incidentId,
    subject: e.subject,
    riskLevel: e.riskLevel,
    riskScore: e.riskScore,
    receivedAt: e.receivedAt,
    analyst,
  };
}

/** Recent-investigations row list, with real uploads surfaced first. */
export function useRecentInvestigations() {
  const uploaded = useUploadedList();
  return useMemo(
    () => [...uploaded.map((e) => toRow(e, "You (uploaded)")), ...demoRecent],
    [uploaded]
  );
}

/** Full history table rows, with real uploads surfaced first. */
export function useHistoryRecords() {
  const uploaded = useUploadedList();
  return useMemo(
    () => [...uploaded.map((e) => toRow(e, "You (uploaded)")), ...demoHistory],
    [uploaded]
  );
}

```

### `src/lib/risk.ts`

```ts
import type { RiskLevel } from "@/data/types";

export const riskConfig: Record<
  RiskLevel,
  { label: string; text: string; bg: string; border: string; dot: string; ring: string }
> = {
  critical: {
    label: "Critical",
    text: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/30",
    dot: "bg-critical",
    ring: "stroke-critical",
  },
  high: {
    label: "High",
    text: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/30",
    dot: "bg-critical",
    ring: "stroke-critical",
  },
  medium: {
    label: "Medium",
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    dot: "bg-warning",
    ring: "stroke-warning",
  },
  low: {
    label: "Low",
    text: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    dot: "bg-warning",
    ring: "stroke-warning",
  },
  safe: {
    label: "Safe",
    text: "text-safe",
    bg: "bg-safe/10",
    border: "border-safe/30",
    dot: "bg-safe",
    ring: "stroke-safe",
  },
};

export function scoreToLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  if (score >= 15) return "low";
  return "safe";
}

```

### `src/lib/store.ts`

```ts
/**
 * SentinelMail — Analysis Session Store
 * -----------------------------------------------------------------------
 * A minimal zustand store holding real emails the user has uploaded
 * and analyzed this session. In-memory only — no backend, no
 * persistence, cleared on page refresh. See `src/lib/emails.ts` for
 * the hooks that merge this with the curated demo data set.
 *
 * NOTE: only the raw `records` map is exposed from this store. A
 * derived/sorted array must NOT be computed inside a selector — doing
 * so returns a new array reference on every call and breaks React's
 * useSyncExternalStore snapshot caching (causes an infinite render
 * loop). Sorting happens in `useMemo` in `src/lib/emails.ts` instead.
 * -----------------------------------------------------------------------
 */
import { create } from "zustand";
import type { EmailRecord } from "@/data/types";

interface AnalysisStore {
  records: Record<string, EmailRecord>;
  add: (record: EmailRecord) => void;
}

// NOTE: only expose the raw `records` map from the store selector. Deriving a
// sorted array *inside* a selector (e.g. `list: () => Object.values(...).sort()`)
// returns a new array reference on every call, which breaks React's
// useSyncExternalStore snapshot caching and causes an infinite render loop.
// Sorting/array conversion happens in useMemo in src/lib/emails.ts instead.
export const useAnalysisStore = create<AnalysisStore>((set) => ({
  records: {},
  add: (record) =>
    set((state) => ({ records: { ...state.records, [record.id]: record } })),
}));

```

### `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

### `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

```

### `src/pages/AnalysisResults.tsx`

```tsx
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

```

### `src/pages/AnalyzeEmail.tsx`

```tsx
/**
 * SentinelMail — Analyze Email
 * -----------------------------------------------------------------------
 * Route:        "/analyze"
 * Purpose:      Entry point of the detection pipeline. Accepts a real
 *               .eml upload (drag-and-drop or file picker), parses it
 *               client-side, and scores it live via the rule-based
 *               engine — or loads a curated demo phishing sample.
 * Data source:  `parseEmailFile()` + `analyzeParsedEmail()` for real
 *               uploads; a fixed demo record ("EML-40921") for the
 *               "Load Sample" path.
 * -----------------------------------------------------------------------
 */
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, CheckCircle2, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { parseEmailFile } from "@/lib/emailParser";
import { analyzeParsedEmail } from "@/lib/analyzeEngine";
import { useAnalysisStore } from "@/lib/store";

const STEPS = [
  "Parsing Email",
  "Extracting Indicators",
  "Authentication Check",
  "Threat Analysis",
  "Correlation",
  "Investigation",
];

export function AnalyzeEmail() {
  const navigate = useNavigate();
  const addRecord = useAnalysisStore((s) => s.add);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runStepAnimation = useCallback((onDone: () => void) => {
    setAnalyzing(true);
    setStepIndex(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= STEPS.length) {
        clearInterval(interval);
        setTimeout(onDone, 350);
        return;
      }
      setStepIndex(i);
    }, 500);
  }, []);

  const analyzeRealFile = useCallback(
    async (file: File) => {
      setError(null);
      setFileName(file.name);
      runStepAnimation(async () => {
        try {
          const parsed = await parseEmailFile(file);
          const record = analyzeParsedEmail(parsed);
          addRecord(record);
          navigate(`/analysis/${record.id}`);
        } catch (e) {
          setAnalyzing(false);
          setError(
            "Couldn't parse this file as a valid .eml message. Make sure it's a raw email export (not .msg or a screenshot), or try the sample instead."
          );
        }
      });
    },
    [addRecord, navigate, runStepAnimation]
  );

  const runSampleAnalysis = useCallback(() => {
    setError(null);
    setFileName("sample-phishing-invoice.eml");
    runStepAnimation(() => navigate("/analysis/EML-40921"));
  }, [navigate, runStepAnimation]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) analyzeRealFile(file);
    },
    [analyzeRealFile]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeRealFile(file);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-lg font-semibold text-text tracking-tight">Analyze Email</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Upload a raw .eml file for real, in-browser forensic analysis, or load a sample to see the full workflow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Upload Email</CardTitle>
            <CardDescription>Accepts .eml files up to 25MB · parsed entirely in your browser</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!analyzing ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-12 text-center cursor-pointer transition-colors",
                dragging ? "border-cyan/60 bg-cyan/5" : "border-border-soft hover:border-border hover:bg-surface-2/40"
              )}
            >
              <input ref={inputRef} type="file" accept=".eml" className="hidden" onChange={handleFileSelect} />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 border border-border">
                <UploadCloud className="h-5.5 w-5.5 text-text-muted" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm text-text">
                  <span className="text-cyan font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-text-dim mt-1">.eml files only — each upload is independently parsed and scored</p>
              </div>
              {fileName && !error && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-muted">
                  <FileText className="h-3.5 w-3.5" />
                  {fileName}
                </div>
              )}
            </div>
          ) : (
            <AnalysisSequence stepIndex={stepIndex} />
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-critical/30 bg-critical/10 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-critical shrink-0 mt-0.5" />
              <p className="text-sm text-critical">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!analyzing && (
        <Card>
          <CardContent className="pt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-cyan/10 border border-cyan/25 shrink-0">
                <Sparkles className="h-4.5 w-4.5 text-cyan" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm text-text font-medium">Load Sample Phishing Email</p>
                <p className="text-xs text-text-muted mt-0.5 max-w-md">
                  Runs the full detection pipeline against a curated credential-theft sample with a pre-built
                  correlation and campaign, so you can see the deeper investigation views populated.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={runSampleAnalysis}>
              Load Sample
            </Button>
          </CardContent>
        </Card>
      )}

      {!analyzing && (
        <p className="text-xs text-text-dim leading-relaxed">
          Real uploads are scored by a rule-based engine (urgency language, brand/domain mismatch, SPF/DKIM/DMARC
          headers if present, suspicious link patterns, risky attachment types) — not a live threat-intelligence feed
          or a trained ML model. IP, domain, and URL reputations shown for real uploads are marked accordingly.
        </p>
      )}
    </div>
  );
}

function AnalysisSequence({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="py-4">
      <ul className="space-y-3">
        {STEPS.map((step, idx) => {
          const done = idx < stepIndex;
          const active = idx === stepIndex;
          return (
            <li key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  done && "bg-safe/15 border-safe/40 text-safe",
                  active && "bg-cyan/15 border-cyan/40 text-cyan",
                  !done && !active && "bg-surface-3 border-border text-text-dim"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : active ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-mono",
                  done && "text-text-muted",
                  active && "text-text",
                  !done && !active && "text-text-dim"
                )}
              >
                {step}
              </span>
              {active && (
                <span className="ml-auto h-px flex-1 max-w-24 bg-gradient-to-r from-cyan/40 to-transparent" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

```

### `src/pages/CorrelationGraphPage.tsx`

```tsx
/**
 * SentinelMail — Correlation Graph
 * -----------------------------------------------------------------------
 * Route:        "/correlation"
 * Purpose:      Visualizes shared infrastructure (domain/IP/URL) across
 *               incidents as an interactive network graph, surfacing
 *               potential campaigns. Built with React Flow; lazy-loaded
 *               from App.tsx since it's the heaviest route.
 * Data source:  The curated demo `campaign` record and its two related
 *               sample emails — correlation is not computed for real
 *               uploads in this MVP.
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Waypoints, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CorrelationNode, type CorrelationNodeData } from "@/components/CorrelationNode";
import { campaign, emails } from "@/data/mock";

const nodeTypes = { correlation: CorrelationNode };

const emailA = emails[0];
const emailB = emails[1];
const sharedDomain = campaign.sharedDomain;
const sharedIp = campaign.sharedIp;
const url = emailA.urls[0];

const initialNodes: Node<CorrelationNodeData>[] = [
  {
    id: "email-a",
    type: "correlation",
    position: { x: 40, y: 40 },
    data: { kind: "email", title: emailA.id, subtitle: "Phishing / Credential Theft", tone: "critical" },
  },
  {
    id: "email-b",
    type: "correlation",
    position: { x: 440, y: 40 },
    data: { kind: "email", title: emailB.id, subtitle: "Credential Theft", tone: "critical" },
  },
  {
    id: "domain",
    type: "correlation",
    position: { x: 240, y: 200 },
    data: { kind: "domain", title: sharedDomain, subtitle: "Registered 6 days prior", tone: "warning" },
  },
  {
    id: "ip",
    type: "correlation",
    position: { x: 240, y: 360 },
    data: { kind: "ip", title: sharedIp, subtitle: "Bucharest, Romania (approx.)", tone: "warning" },
  },
  {
    id: "url",
    type: "correlation",
    position: { x: 20, y: 360 },
    data: { kind: "url", title: "/login/confirm-identity", subtitle: url?.category ?? "Credential harvesting", tone: "cyan" },
  },
];

const initialEdges: Edge[] = [
  { id: "e-a-domain", source: "email-a", target: "domain", animated: true, style: { stroke: "#f59e0b" } },
  { id: "e-a-ip", source: "email-a", target: "ip", animated: true, style: { stroke: "#f59e0b" } },
  { id: "e-a-url", source: "email-a", target: "url", style: { stroke: "#22d3ee" } },
  { id: "e-b-domain", source: "email-b", target: "domain", animated: true, style: { stroke: "#f59e0b" } },
  { id: "e-b-ip", source: "email-b", target: "ip", animated: true, style: { stroke: "#f59e0b" } },
];

export function CorrelationGraphPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const selectedInfo = useMemo(() => {
    const map: Record<string, { title: string; lines: string[] }> = {
      "email-a": { title: emailA.id, lines: [emailA.subject, emailA.from, `Risk score ${emailA.riskScore}/100`] },
      "email-b": { title: emailB.id, lines: [emailB.subject, emailB.from, `Risk score ${emailB.riskScore}/100`] },
      domain: { title: sharedDomain, lines: ["Registered 2026-08-27 via NiceNIC.NET", "Flagged malicious by threat feeds", "Shared by 2 incidents"] },
      ip: { title: sharedIp, lines: ["AS9009 (M247 Ltd)", "Approximate IP infrastructure location: Bucharest, Romania", "Associated with 14 prior campaigns"] },
      url: { title: url?.url ?? "", lines: [url?.category ?? "", url?.notes ?? ""] },
    };
    return selectedNode ? map[selectedNode] : null;
  }, [selectedNode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text tracking-tight">Correlation Graph</h1>
        <p className="text-sm text-text-muted mt-0.5">Shared infrastructure across incidents, visualized as a network</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-warning/25 bg-warning/5">
          <CardContent className="pt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning/15 border border-warning/30 shrink-0">
              <Waypoints className="h-5 w-5 text-warning" />
            </div>
            <div>
              <div className="text-sm font-semibold text-text">Potential Campaign Detected</div>
              <div className="text-xs text-text-muted mt-0.5">{campaign.name}</div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">Related Incidents</div>
              <div className="font-mono text-2xl font-semibold text-text mt-1">{campaign.relatedIncidents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="text-[11px] uppercase tracking-wide text-text-dim font-medium">Correlation Confidence</div>
              <div className="font-mono text-2xl font-semibold text-cyan mt-1">{campaign.confidence}%</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div>
            <CardTitle>Infrastructure Map</CardTitle>
            <CardDescription>Click a node to inspect the underlying evidence</CardDescription>
          </div>
        </CardHeader>
        <div className="h-[440px] border-t border-border">
          <ReactFlow
            nodes={initialNodes}
            edges={initialEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            fitView
            proOptions={{ hideAttribution: true }}
            colorMode="dark"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1a2233" />
            <Controls showInteractive={false} className="!bg-surface-2 !border-border [&_button]:!bg-surface-2 [&_button]:!border-border [&_button]:!text-text-muted" />
            <MiniMap
              className="!bg-surface-2 !border-border"
              nodeColor="#3b4a63"
              maskColor="rgba(9,12,18,0.55)"
            />
          </ReactFlow>
        </div>
      </Card>

      {selectedInfo && (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 text-sm font-mono text-cyan mb-2">
              <Link2 className="h-3.5 w-3.5" /> {selectedInfo.title}
            </div>
            <ul className="space-y-1">
              {selectedInfo.lines.filter(Boolean).map((line) => (
                <li key={line} className="text-sm text-text-muted">{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

```

### `src/pages/Dashboard.tsx`

```tsx
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

```

### `src/pages/History.tsx`

```tsx
/**
 * SentinelMail — History
 * -----------------------------------------------------------------------
 * Route:        "/history"
 * Purpose:      Full investigation history across all analyzed emails,
 *               with risk-level filter chips (Safe / Low / Medium /
 *               High / Critical).
 * Data source:  `useHistoryRecords()` — real uploaded emails from this
 *               session, prepended to the curated demo history list.
 * -----------------------------------------------------------------------
 */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { useHistoryRecords } from "@/lib/emails";
import type { RiskLevel } from "@/data/types";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value: RiskLevel | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Safe", value: "safe" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Critical", value: "critical" },
];

export function History() {
  const navigate = useNavigate();
  const historyRecords = useHistoryRecords();
  const [filter, setFilter] = useState<RiskLevel | "all">("all");

  const rows = useMemo(
    () => (filter === "all" ? historyRecords : historyRecords.filter((r) => r.riskLevel === filter)),
    [filter, historyRecords]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-text tracking-tight">History</h1>
        <p className="text-sm text-text-muted mt-0.5">Full investigation history across all analyzed emails</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              filter === f.value
                ? "border-cyan/40 bg-cyan/10 text-cyan"
                : "border-border bg-surface-2 text-text-muted hover:text-text"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="px-0 py-0">
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
              {rows.map((row) => (
                <TR key={row.incidentId} className="cursor-pointer" onClick={() => navigate(`/reports?incident=${row.incidentId}`)}>
                  <TD className="font-mono text-xs text-cyan">{row.incidentId}</TD>
                  <TD className="max-w-[400px] truncate">{row.subject}</TD>
                  <TD><RiskBadge level={row.riskLevel} /></TD>
                  <TD className="font-mono">{row.riskScore}</TD>
                  <TD className="text-text-muted text-xs whitespace-nowrap">{format(new Date(row.receivedAt), "MMM d, HH:mm")}</TD>
                  <TD className="text-text-muted text-xs">{row.analyst}</TD>
                </TR>
              ))}
              {rows.length === 0 && (
                <TR>
                  <TD colSpan={6} className="text-center text-text-muted py-8">No investigations match this filter.</TD>
                </TR>
              )}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

```

### `src/pages/InvestigationTimeline.tsx`

```tsx
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

```

### `src/pages/Reports.tsx`

```tsx
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

```

### `src/pages/Settings.tsx`

```tsx
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

```

### `src/pages/ThreatIntelligence.tsx`

```tsx
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

```

