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
