import type { EdgeProps } from "@xyflow/react";

// WindingEdge — a paved-road look between two steps: a smooth S-curve
// (bezier control points held at each end's own height) rendered as layered
// strokes — gray boundary, dark asphalt, white dashed center line — inspired
// by a classic roadmap-infographic road. A thin magenta accent rides on top
// once the source step is completed, so progress is still readable.
export function WindingEdge({ sourceX, sourceY, targetX, targetY, data }: EdgeProps) {
  const midX = (sourceX + targetX) / 2;
  const path = `M ${sourceX},${sourceY} C ${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;
  const sourceDone = (data as any)?.sourceDone as boolean | undefined;

  return (
    <g>
      {/* Lighter-gray outer boundary */}
      <path d={path} fill="none" stroke="#8a8a8a" strokeWidth={16} strokeLinecap="round" />
      {/* Dark asphalt */}
      <path d={path} fill="none" stroke="#2b2b2b" strokeWidth={12} strokeLinecap="round" />
      {/* White dashed center line */}
      <path
        d={path}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeDasharray="6 6"
        strokeLinecap="butt"
      />
      {/* Progress accent — a thin magenta line riding the road once unlocked */}
      {sourceDone && (
        <path
          d={path}
          fill="none"
          stroke="hsl(340 82% 52% / 0.8)"
          strokeWidth={3}
          strokeLinecap="round"
          transform="translate(0, 9)"
        />
      )}
    </g>
  );
}
