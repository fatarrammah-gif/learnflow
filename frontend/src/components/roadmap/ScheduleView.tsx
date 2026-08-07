import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SkillNode } from "@/types/roadmap";

interface Props {
  nodes: SkillNode[];
  hoursPerWeek: number;  // How many hours the user said they can study per week
  onNodeClick: (id: number) => void;
}

// ScheduleView groups nodes into weeks based on estimated hours
// When a week would exceed hoursPerWeek, we start a new week column
export function ScheduleView({ nodes, hoursPerWeek, onNodeClick }: Props) {
  const weeks: SkillNode[][] = [];
  let week: SkillNode[] = [];
  let weekHours = 0;

  for (const node of [...nodes].sort((a, b) => a.sort_order - b.sort_order)) {
    // If adding this node would exceed the week budget and the week isn't empty → start a new week
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
      {weeks.map((weekNodes, wi) => (
        <Card key={wi}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Week {wi + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weekNodes.map((node) => (
              <div
                key={node.id}
                className="p-2 rounded border cursor-pointer hover:border-primary transition-colors"
                onClick={() => onNodeClick(node.id)}
              >
                <div className="text-sm font-medium">{node.title}</div>
                <div className="flex gap-1 mt-1">
                  <Badge variant="outline" className="text-xs">{node.category}</Badge>
                  <span className="text-xs text-muted-foreground">{node.estimated_hours}h</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
