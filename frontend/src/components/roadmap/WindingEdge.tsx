import { BaseEdge, type EdgeProps } from "@xyflow/react";

// WindingEdge — a smooth S-curve between two nodes so a chain of edges reads
// as one continuous winding road instead of separate straight/orthogonal
// segments. Both bezier control points sit at the horizontal midpoint, one
// held at the source's height and one at the target's — a simple, reliable
// way to get a swooping curve through arbitrary alternating heights.
export function WindingEdge({ sourceX, sourceY, targetX, targetY, style, markerEnd }: EdgeProps) {
  const midX = (sourceX + targetX) / 2;
  const path = `M ${sourceX},${sourceY} C ${midX},${sourceY} ${midX},${targetY} ${targetX},${targetY}`;

  return <BaseEdge path={path} style={style} markerEnd={markerEnd} />;
}
