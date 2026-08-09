import { Handle, Position, type NodeProps } from "@xyflow/react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cardHover } from "@/lib/motion";

// Rainbow pin palette, rotating one color per step (not tied to category) —
// matches the reference roadmap infographic's varied map-pin colors. The
// card's border/accent uses the same color as its number marker so the two
// read as one unit.
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

export function SkillNode({ data, selected }: NodeProps) {
  const d = data as any;
  const stepNumber: number = d.stepNumber ?? 1;
  const pinColor = PIN_RAINBOW[(stepNumber - 1) % PIN_RAINBOW.length];

  return (
    <motion.div
      className="relative px-[60px] py-[45px] rounded-[45px] border-[8px] cursor-pointer min-w-[600px] max-w-[788px] shadow-lg bg-white"
      style={{ borderColor: pinColor, opacity: d.is_completed ? 0.5 : 1 }}
      onClick={() => d.onNodeClick?.(d.nodeId)}
      {...cardHover}
      animate={{
        boxShadow: selected
          ? "0 8px 24px -4px rgb(0 0 0 / 0.25)"
          : "0 4px 14px -2px rgb(0 0 0 / 0.12)",
      }}
    >
      {/* Square destination marker — the "node" for this location, same
          color as the card border so they read as one unit */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[120px] w-[120px] h-[120px] rounded-[24px] shadow-md border-[6px] border-white flex items-center justify-center text-[36px] font-bold text-white"
        style={{ background: pinColor }}
      >
        {stepNumber}
      </div>

      <Handle type="target" position={Position.Left} className="!bg-border !border-border !w-2 !h-2" />

      <div className="flex items-start gap-[30px]">
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
            <CheckCircle2 size={50} className="text-green-500 mt-0.5" />
          ) : (
            <div
              className="w-[23px] h-[23px] rounded-full mt-[23px]"
              style={{ background: pinColor }}
            />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[52px] leading-tight text-foreground font-display">
            {d.title}
          </div>
          <div className="text-[45px] text-muted-foreground mt-6 flex items-center gap-[18px]">
            <span>{d.category}</span>
            <span className="text-border/60">·</span>
            <span className="font-mono text-[42px] text-primary/80">
              {d.estimated_hours}h
            </span>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-border !border-border !w-2 !h-2" />
    </motion.div>
  );
}
