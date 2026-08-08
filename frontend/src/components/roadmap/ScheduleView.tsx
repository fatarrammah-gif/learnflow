import { motion } from "framer-motion";
import { MotionCard } from "@/components/ui/card";
import { cardHover } from "@/lib/motion";
import type { SkillNode } from "@/types/roadmap";

interface Props {
  nodes: SkillNode[];
  hoursPerWeek: number;
  onNodeClick: (id: number) => void;
}

// ScheduleView groups nodes into week columns.
// Each week card has a coral left-border header and a list of node rows.
export function ScheduleView({ nodes, hoursPerWeek, onNodeClick }: Props) {
  // Group nodes into weeks based on cumulative estimated hours
  const weeks: SkillNode[][] = [];
  let week: SkillNode[] = [];
  let weekHours = 0;

  for (const node of [...nodes].sort((a, b) => a.sort_order - b.sort_order)) {
    if (weekHours + node.estimated_hours > hoursPerWeek && week.length > 0) {
      weeks.push(week);
      week = [node];
      weekHours = node.estimated_hours;
    } else {
      week.push(node);
      weekHours += node.estimated_hours;
    }
  }
  if (week.length > 0) weeks.push(week);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
      {weeks.map((weekNodes, wi) => {
        const totalHours = weekNodes.reduce((s, n) => s + n.estimated_hours, 0);
        return (
          <MotionCard key={wi} variant="elevated" {...cardHover}>
            {/* Week header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span
                className="font-bold text-sm text-foreground font-display"
              >
                Week {wi + 1}
              </span>
              <span
                className="text-[12px] text-primary font-medium font-mono"
              >
                {totalHours}h
              </span>
            </div>

            {/* Node list */}
            <div className="p-3 space-y-2">
              {weekNodes.map((node) => (
                <div
                  key={node.id}
                  className="group flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={() => onNodeClick(node.id)}
                >
                  {/* Category color dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium text-foreground leading-snug font-display"
                    >
                      {node.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{node.category}</span>
                      <span
                        className="text-[10px] text-primary/70 font-mono"
                      >
                        {node.estimated_hours}h
                      </span>
                    </div>
                    {/* Mini progress bar — zero until progress is logged */}
                    <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: node.is_completed ? "100%" : "0%" }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MotionCard>
        );
      })}
    </div>
  );
}
