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

// Rainbow pin palette, rotating one color per step (not tied to category) —
// matches the reference roadmap infographic's varied map-pin colors.
const PIN_RAINBOW = [
  "#2f69aa", // blue
  "#169fc9", // cyan
  "#63a447", // green
  "#f1b51f", // yellow
  "#df8723", // orange
  "#d62e2e", // red
  "#c52670", // pink
  "#7b2862", // purple
];

const FALLBACK = { border: "border-border", bg: "bg-card", dot: "bg-muted-foreground" };

export function SkillNode({ data, selected }: NodeProps) {
  const d = data as any;
  const colors = CATEGORY_COLORS[d.category] ?? FALLBACK;
  const stepNumber: number = d.stepNumber ?? 1;
  const pinColor = PIN_RAINBOW[(stepNumber - 1) % PIN_RAINBOW.length];

  return (
    <div
      className={cn(
        "relative px-[40px] py-[30px] rounded-[30px] border-[5px] cursor-pointer min-w-[400px] max-w-[525px] shadow-sm transition-all bg-white",
        colors.border,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md",
        d.is_completed && "opacity-50"
      )}
      onClick={() => d.onNodeClick?.(d.nodeId)}
    >
      {/* Square destination marker — milestone marker along the winding road */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[80px] w-[80px] h-[80px] rounded-2xl shadow-md border-4 border-white flex items-center justify-center text-2xl font-bold text-white"
        style={{ background: pinColor }}
      >
        {stepNumber}
      </div>

      <Handle type="target" position={Position.Left} className="!bg-border !border-border !w-2 !h-2" />

      <div className="flex items-start gap-5">
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
            <CheckCircle2 size={33} className="text-green-500 mt-0.5" />
          ) : (
            <div className={cn("w-[15px] h-[15px] rounded-full mt-[15px]", colors.dot)} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[35px] leading-tight text-foreground font-display">
            {d.title}
          </div>
          <div className="text-[30px] text-muted-foreground mt-4 flex items-center gap-3">
            <span>{d.category}</span>
            <span className="text-border/60">·</span>
            <span className="font-mono text-[28px] text-primary/80">
              {d.estimated_hours}h
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-border !border-border !w-2 !h-2" />
    </div>
  );
}
