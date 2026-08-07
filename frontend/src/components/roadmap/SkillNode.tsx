import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Each category gets a different border/background color so nodes are visually grouped
const CATEGORY_COLORS: Record<string, string> = {
  Foundations: "border-blue-400 bg-blue-50",
  "Core Concepts": "border-purple-400 bg-purple-50",
  Advanced: "border-orange-400 bg-orange-50",
  Projects: "border-green-400 bg-green-50",
};

// NodeProps is the type React Flow passes to every custom node component
// `data` contains whatever we put in the node's data field when building the flow
export function SkillNode({ data, selected }: NodeProps) {
  const d = data as any;
  // Fall back to grey if the category doesn't match any key above
  const color = CATEGORY_COLORS[d.category] ?? "border-gray-300 bg-white";

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border-2 shadow-sm cursor-pointer min-w-[160px] max-w-[200px] transition-all",
        color,
        selected && "ring-2 ring-primary ring-offset-2",   // Blue ring when selected
        d.is_completed && "opacity-60"                      // Dimmed when done
      )}
      onClick={() => d.onNodeClick?.(d.nodeId)}
    >
      {/* Handle = the connection point at the top of the node (input / target) */}
      <Handle type="target" position={Position.Top} />

      <div className="flex items-start gap-2">
        {d.is_completed && <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-tight">{d.title}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="bg-white/60 rounded px-1">{d.category}</span>
            {" · "}{d.estimated_hours}h
          </div>
        </div>
      </div>

      {/* Handle = the connection point at the bottom (output / source) */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
