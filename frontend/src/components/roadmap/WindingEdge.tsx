import type { EdgeProps } from "@xyflow/react";

interface RoadPoint {
  x: number;
  y: number;
  completed: boolean;
}

// WindingEdge — renders the ENTIRE roadmap as one continuous paved road
// through every step in sequence (via `data.points`), not a separate curve
// per pair of nodes. Each consecutive pair gets its own smooth S-curve
// segment (bezier control points held at each end's own height), chained
// into a single path so the whole thing reads as one road with no seams or
// crossing lines — layered as gray boundary, dark asphalt, white dashed
// center line, like a classic roadmap-infographic road. A thin magenta
// accent rides on top of any segment whose starting step is complete.
export function WindingEdge({ data }: EdgeProps) {
  const points = (data as any)?.points as RoadPoint[] | undefined;
  if (!points || points.length < 2) return null;

  const segmentPath = (a: RoadPoint, b: RoadPoint) => {
    const midX = (a.x + b.x) / 2;
    return `${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`;
  };

  let fullPath = `M ${points[0].x},${points[0].y}`;
  const accentSegments: string[] = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    fullPath += ` C ${segmentPath(prev, curr)}`;
    if (prev.completed) {
      accentSegments.push(`M ${prev.x},${prev.y} C ${segmentPath(prev, curr)}`);
    }
  }

  return (
    <g>
      {/* Lighter-gray outer boundary */}
      <path d={fullPath} fill="none" stroke="#8a8a8a" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dark asphalt */}
      <path d={fullPath} fill="none" stroke="#2b2b2b" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      {/* White dashed center line */}
      <path
        d={fullPath}
        fill="none"
        stroke="#ffffff"
        strokeWidth={2}
        strokeDasharray="6 6"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
      {/* Progress accent — a thin magenta line riding completed segments */}
      {accentSegments.map((seg, i) => (
        <path
          key={i}
          d={seg}
          fill="none"
          stroke="hsl(340 82% 52% / 0.8)"
          strokeWidth={3}
          strokeLinecap="round"
          transform="translate(0, 9)"
        />
      ))}
    </g>
  );
}
