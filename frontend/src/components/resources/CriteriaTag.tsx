import { cn } from "@/lib/utils";
import { MATCH_LEVEL_STYLES } from "@/lib/constants";
import type { MatchLevel } from "@/types/resource";

interface Props {
  label: string;           // Name of the criterion (e.g. "Theory Clearness")
  matchLevel: MatchLevel;  // "high" | "medium" | "low" — determines the color
  score: number;           // 0.0 – 1.0 score from AI evaluation
  reasoning?: string | null; // AI's explanation, shown as a tooltip on hover
}

// CriteriaTag — a colored pill showing how well a video matches one criterion
// The title attribute creates a native browser tooltip showing the reasoning
export function CriteriaTag({ label, matchLevel, score, reasoning }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        MATCH_LEVEL_STYLES[matchLevel]
      )}
      title={reasoning ?? undefined}
    >
      {label} · {Math.round(score * 100)}%
    </span>
  );
}
