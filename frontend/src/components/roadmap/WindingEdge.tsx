import type { EdgeProps } from "@xyflow/react";

interface RoadPoint {
  x: number;
  y: number;
  completed: boolean;
}

// How far the road stays flat/straight on each side of a stop, before it
// starts curving toward the next one — two points at the same height per
// stop instead of a single bend-point, so the road reads as straight right
// where a destination sits.
const STRAIGHT_HALF = 45;

// WindingEdge — renders the ENTIRE roadmap as one continuous paved road
// through every step in sequence (via `data.points`), not a separate curve
// per pair of nodes — layered as gray boundary, dark asphalt, white dashed
// center line, like a classic roadmap-infographic road. A thin magenta
// accent rides on top of any segment whose starting step is complete.
export function WindingEdge({ data }: EdgeProps) {
  const points = (data as any)?.points as RoadPoint[] | undefined;
  if (!points || points.length < 2) return null;

  const approach = (p: RoadPoint) => ({ x: p.x - STRAIGHT_HALF, y: p.y });
  const depart = (p: RoadPoint) => ({ x: p.x + STRAIGHT_HALF, y: p.y });

  const curveBetween = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const midX = (a.x + b.x) / 2;
    return `${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`;
  };

  // Start at the first stop's approach point, straight through to its depart
  // point, then curve to the next stop's approach point, straight through
  // it, and so on — a flat stretch at every stop, curves only in between.
  let fullPath = `M ${approach(points[0]).x},${approach(points[0]).y} L ${depart(points[0]).x},${depart(points[0]).y}`;
  const accentSegments: string[] = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const prevDepart = depart(prev);
    const currApproach = approach(curr);
    const currDepart = depart(curr);

    fullPath += ` C ${curveBetween(prevDepart, currApproach)}`;
    fullPath += ` L ${currDepart.x},${currDepart.y}`;

    if (prev.completed) {
      accentSegments.push(
        `M ${prevDepart.x},${prevDepart.y} C ${curveBetween(prevDepart, currApproach)}`
      );
    }
  }

  return (
    <g>
      {/* Lighter-gray outer boundary */}
      <path d={fullPath} fill="none" stroke="#8a8a8a" strokeWidth={96} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dark asphalt */}
      <path d={fullPath} fill="none" stroke="#2b2b2b" strokeWidth={72} strokeLinecap="round" strokeLinejoin="round" />
      {/* White dashed center line */}
      <path
        d={fullPath}
        fill="none"
        stroke="#ffffff"
        strokeWidth={12}
        strokeDasharray="36 36"
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
          strokeWidth={18}
          strokeLinecap="round"
          transform="translate(0, 54)"
        />
      ))}
    </g>
  );
}
