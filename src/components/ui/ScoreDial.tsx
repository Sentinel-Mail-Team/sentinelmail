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
