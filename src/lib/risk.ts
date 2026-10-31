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
