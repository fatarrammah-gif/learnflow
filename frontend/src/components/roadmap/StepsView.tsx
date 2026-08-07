import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillNode } from "@/types/roadmap";

interface Props {
  nodes: SkillNode[];
  onNodeClick: (id: number) => void;
}

// StepsView shows the roadmap as a numbered vertical list
// Nodes are sorted by sort_order so they appear in the correct learning sequence
export function StepsView({ nodes, onNodeClick }: Props) {
  const sorted = [...nodes].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <div className="space-y-3 max-w-2xl mx-auto p-6">
      {sorted.map((node, i) => (
        <Card
          key={node.id}
          className={cn("cursor-pointer hover:border-primary transition-all", node.is_completed && "opacity-60")}
          onClick={() => onNodeClick(node.id)}
        >
          <CardContent className="p-4 flex gap-4">
            {/* Step number column with a vertical connector line */}
            <div className="shrink-0 flex flex-col items-center gap-1">
              {node.is_completed
                ? <CheckCircle2 className="text-green-500" size={22} />
                : <div className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-bold">{i + 1}</div>
              }
              {/* Vertical line connecting this step to the next */}
              {i < sorted.length - 1 && <div className="w-0.5 h-4 bg-muted" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{node.title}</span>
                <Badge variant="outline" className="text-xs">{node.category}</Badge>
                <span className="text-xs text-muted-foreground">~{node.estimated_hours}h</span>
              </div>
              {node.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{node.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
