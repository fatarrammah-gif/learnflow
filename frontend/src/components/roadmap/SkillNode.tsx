import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Dark-mode category colors — tinted borders and semi-transparent fills
const CATEGORY_COLORS: Record<string, { border: string; bg: string; dot: string }> = {
  Foundations:    { border: "border-blue-400/60",   bg: "bg-blue-500/10",   dot: "bg-blue-400" },
  "Core Concepts":{ border: "border-violet-400/60", bg: "bg-violet-500/10", dot: "bg-violet-400" },
  Advanced:       { border: "border-amber-400/60",  bg: "bg-amber-500/10",  dot: "bg-amber-400" },
  Projects:       { border: "border-emerald-400/60",bg: "bg-emerald-500/10",dot: "bg-emerald-400" },
};

const FALLBACK = { border: "border-border", bg: "bg-card", dot: "bg-muted-foreground" };

export function SkillNode({ data, selected }: NodeProps) {
  const d = data as any;
  const colors = CATEGORY_COLORS[d.category] ?? FALLBACK;

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border cursor-pointer min-w-[160px] max-w-[210px] transition-all",
        colors.border, colors.bg,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        d.is_completed && "opacity-50"
      )}
      onClick={() => d.onNodeClick?.(d.nodeId)}
    >
      <Handle type="target" position={Position.Top} className="!bg-border !border-border" />

      <div className="flex items-start gap-2">
        {d.is_completed ? (
          <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
        ) : (
          /* Category dot */
          <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", colors.dot)} />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-tight text-foreground">{d.title}</div>
          <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
            <span>{d.category}</span>
            <span className="text-border">·</span>
            <span
              className="font-mono text-[11px]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {d.estimated_hours}h
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-border !border-border" />
    </div>
  );
}
