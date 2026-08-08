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

const FALLBACK = { border: "border-border", bg: "bg-card", dot: "bg-muted-foreground" };

export function SkillNode({ data, selected }: NodeProps) {
  const d = data as any;
  const colors = CATEGORY_COLORS[d.category] ?? FALLBACK;

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-xl border-2 cursor-pointer min-w-[160px] max-w-[210px] shadow-sm transition-all bg-white",
        colors.border,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md",
        d.is_completed && "opacity-50"
      )}
      onClick={() => d.onNodeClick?.(d.nodeId)}
    >
      <Handle type="target" position={Position.Top} className="!bg-border !border-border !w-2 !h-2" />

      <div className="flex items-start gap-2">
        {d.is_completed ? (
          <CheckCircle2 size={13} className="text-green-500 mt-0.5 shrink-0" />
        ) : (
          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", colors.dot)} />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm leading-tight text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {d.title}
          </div>
          <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span>{d.category}</span>
            <span className="text-border/60">·</span>
            <span className="font-mono text-[11px] text-primary/80" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {d.estimated_hours}h
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-border !border-border !w-2 !h-2" />
    </div>
  );
}
