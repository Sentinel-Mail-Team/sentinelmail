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
