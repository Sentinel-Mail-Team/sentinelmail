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
