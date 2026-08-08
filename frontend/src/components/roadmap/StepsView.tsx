import { CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillNode } from "@/types/roadmap";

interface Props {
  nodes: SkillNode[];
  onNodeClick: (id: number) => void;
  hoursPerWeek?: number;
}

// Group nodes into weeks based on cumulative estimated hours
function groupByWeek(nodes: SkillNode[], hoursPerWeek: number): SkillNode[][] {
  const weeks: SkillNode[][] = [];
  let week: SkillNode[] = [];
  let used = 0;
  for (const node of nodes) {
    if (used + node.estimated_hours > hoursPerWeek && week.length > 0) {
      weeks.push(week);
      week = [node];
      used = node.estimated_hours;
    } else {
      week.push(node);
      used += node.estimated_hours;
    }
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}

// StepsView — vertical timeline with week dividers.
// The timeline line runs down the left, with dots at each node.
// Completed = coral filled, active (first incomplete) = coral with pulse ring, future = gray.
export function StepsView({ nodes, onNodeClick, hoursPerWeek = 10 }: Props) {
  const sorted = [...nodes].sort((a, b) => a.sort_order - b.sort_order);
  const weeks = groupByWeek(sorted, hoursPerWeek);

  // Index of the first uncompleted node — shown as "active"
  const firstIncompleteIdx = sorted.findIndex((n) => !n.is_completed);

  // Flatten to (weekIdx, nodeIdx) for rendering with week dividers
  type Entry = { weekIdx: number; node: SkillNode; globalIdx: number };
  const entries: Entry[] = [];
  let g = 0;
  for (let wi = 0; wi < weeks.length; wi++) {
    for (const node of weeks[wi]) {
      entries.push({ weekIdx: wi, node, globalIdx: g++ });
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {entries.map((entry, i) => {
        const { weekIdx, node, globalIdx } = entry;
        const isFirstInWeek = i === 0 || entries[i - 1].weekIdx !== weekIdx;
        const isLast = i === entries.length - 1;
        const isDone = node.is_completed;
        const isActive = globalIdx === firstIncompleteIdx;

        return (
          <div key={node.id}>
            {/* Week divider — inline between timeline items */}
            {isFirstInWeek && (
              <div className="flex items-center gap-3 mb-5 mt-2 first:mt-0">
                <div className="ml-[11px] w-px h-4 bg-border" />
                <div className="flex items-center gap-2 flex-1">
                  <span
                    className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 bg-background px-2"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Week {weekIdx + 1}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                  <span
                    className="text-[11px] font-mono text-primary/60 bg-background px-1"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {weeks[weekIdx].reduce((s, n) => s + n.estimated_hours, 0)}h
                  </span>
                </div>
              </div>
            )}

            {/* Timeline row */}
            <div className="flex gap-4">
              {/* Left: dot + connector line */}
              <div className="flex flex-col items-center w-6 shrink-0">
                {/* Dot */}
                <div className="relative flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 size={22} className="text-primary" />
                  ) : isActive ? (
                    <>
                      {/* Coral pulse ring on the active node */}
                      <div className="absolute w-5 h-5 rounded-full bg-primary/20 animate-ping" />
                      <div className="w-3 h-3 rounded-full bg-primary relative z-10" />
                    </>
                  ) : (
                    <div className="w-3 h-3 rounded-full border-2 border-border bg-background" />
                  )}
                </div>
                {/* Connector line to next node */}
                {!isLast && (
                  <div className={cn("w-px flex-1 mt-1", isDone ? "bg-primary/40" : "bg-border")} />
                )}
              </div>

              {/* Right: node card */}
              <div
                className={cn(
                  "flex-1 mb-4 rounded-xl border bg-card p-4 cursor-pointer",
                  "transition-all hover:shadow-md hover:border-primary/40 group",
                  isDone && "opacity-60",
                  isActive && "border-primary/30 shadow-sm"
                )}
                onClick={() => onNodeClick(node.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-semibold text-sm text-foreground leading-snug"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      {node.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                        {node.category}
                      </span>
                      <span
                        className="text-[11px] text-primary/70"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {node.estimated_hours}h
                      </span>
                    </div>
                    {node.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>
                    )}
                  </div>
                  {/* Micro-CTA — only visible on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      <span>Resources</span>
                      <ArrowRight size={11} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
