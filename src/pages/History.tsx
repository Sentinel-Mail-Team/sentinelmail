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
