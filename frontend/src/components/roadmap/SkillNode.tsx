import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Light-mode warm category colors — soft tints on white, colored borders
const CATEGORY_COLORS: Record<string, { border: string; bg: string; dot: string }> = {
  Foundations:     { border: "border-blue-300",   bg: "bg-blue-50",   dot: "bg-blue-400" },
  "Core Concepts": { border: "border-violet-300", bg: "bg-violet-50", dot: "bg-violet-400" },
  Advanced:        { border: "border-orange-300", bg: "bg-orange-50", dot: "bg-orange-400" },
  Projects:        { border: "border-green-300",  bg: "bg-green-50",  dot: "bg-green-500" },
};

// Solid fills for the numbered "pin" badge — same category hue family as
// CATEGORY_COLORS above, but solid rather than a light tint, so the pin
// reads as a milestone marker distinct from the card's own border/bg tint.
const PIN_COLORS: Record<string, string> = {
  Foundations:     "bg-blue-500",
  "Core Concepts": "bg-violet-500",
  Advanced:        "bg-orange-500",
  Projects:        "bg-green-600",
};

const FALLBACK = { border: "border-border", bg: "bg-card", dot: "bg-muted-foreground" };

export function SkillNode({ data, selected }: NodeProps) {
  const d = data as any;
  const colors = CATEGORY_COLORS[d.category] ?? FALLBACK;
  const pinColor = PIN_COLORS[d.category] ?? "bg-muted-foreground";

  return (
    <div
      className={cn(
        "relative px-4 py-3 rounded-xl border-2 cursor-pointer min-w-[160px] max-w-[210px] shadow-sm transition-all bg-white",
        colors.border,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md",
        d.is_completed && "opacity-50"
      )}
      onClick={() => d.onNodeClick?.(d.nodeId)}
    >
      {/* Numbered pin badge — milestone marker along the winding road */}
      <div
        className={cn(
          "absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center",
          "text-xs font-bold text-white shadow-md border-2 border-white",
          pinColor
        )}
      >
        {d.stepNumber}
      </div>

      <Handle type="target" position={Position.Left} className="!bg-border !border-border !w-2 !h-2" />

      <div className="flex items-start gap-2">
        <button
          type="button"
          className="shrink-0 -m-1 p-1"
          title={d.is_completed ? "Mark incomplete" : "Mark complete"}
          onClick={(e) => {
            e.stopPropagation();
            d.onToggleComplete?.(d.nodeId);
          }}
        >
          {d.is_completed ? (
            <CheckCircle2 size={13} className="text-green-500 mt-0.5" />
          ) : (
            <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5", colors.dot)} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight text-foreground font-display">
            {d.title}
          </div>
          <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span>{d.category}</span>
            <span className="text-border/60">·</span>
            <span className="font-mono text-[11px] text-primary/80">
              {d.estimated_hours}h
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-border !border-border !w-2 !h-2" />
    </div>
  );
}
