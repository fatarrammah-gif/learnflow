import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { roadmapsApi } from "@/api/roadmaps";
import { GeneratingOverlay } from "@/components/roadmap/GeneratingOverlay";
import { TimeConflictModal } from "@/components/roadmap/TimeConflictModal";
import { RoadmapFlow } from "@/components/roadmap/RoadmapFlow";
import { StepsView } from "@/components/roadmap/StepsView";
import { ScheduleView } from "@/components/roadmap/ScheduleView";
import { ResourcePanel } from "@/components/resources/ResourcePanel";
import { useRoadmapStore } from "@/store/roadmapStore";
import { Map, Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadmapFormat, TimeStrategy } from "@/types/roadmap";

// Icon and label lookup for the format toggle buttons
const FORMAT_ICONS = {
  interactive_map: Map,
  schedule: Calendar,
  steps: List,
};

const FORMAT_LABELS: Record<RoadmapFormat, string> = {
  interactive_map: "Map",
  schedule: "Schedule",
  steps: "Steps",
};

export function RoadmapPage() {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const { setRoadmap, selectNode } = useRoadmapStore();
  const [viewFormat, setViewFormat] = useState<RoadmapFormat>("interactive_map");

  // useQuery fetches the roadmap and caches it
  // refetchInterval polls every 2 seconds while the roadmap is still generating
  const { data: roadmap, isLoading } = useQuery({
    queryKey: ["roadmap", roadmapId],
    queryFn: () => roadmapsApi.get(Number(roadmapId)),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "generating" ? 2000 : false;  // Stop polling once ready
    },
  });

  // When data arrives, push it into the global roadmap store so other components can read it
  // useEffect runs after the render whenever `roadmap` changes
  useEffect(() => {
    if (roadmap) setRoadmap(roadmap);
  }, [roadmap, setRoadmap]);

  const handleNodeClick = (nodeId: number) => {
    selectNode(nodeId);  // Opens the ResourcePanel for this node
  };

  const handleResolveTime = async (strategy: TimeStrategy) => {
    await roadmapsApi.resolveTime(Number(roadmapId), strategy);
    // After resolving, the query will refetch automatically on next poll
  };

  // Show spinner while loading or while AI is still generating
  if (isLoading || !roadmap || roadmap.status === "generating") {
    return <GeneratingOverlay />;
  }

  // Show time conflict modal if the AI flagged it
  if (roadmap.status === "time_conflict") {
    return <TimeConflictModal onResolve={handleResolveTime} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-baseline gap-3">
          <h1 className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
            Your roadmap
          </h1>
          <span className="text-xs text-muted-foreground font-mono">
            {roadmap.nodes.length} skills ·{" "}
            <span className="text-primary">{roadmap.total_hours_est}h</span>
          </span>
        </div>

        {/* Format toggle — underline style, not filled pill */}
        <div className="flex gap-0 border border-border rounded-lg overflow-hidden">
          {(["interactive_map", "schedule", "steps"] as RoadmapFormat[]).map((fmt) => {
            const Icon = FORMAT_ICONS[fmt];
            return (
              <button
                key={fmt}
                onClick={() => setViewFormat(fmt)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-r border-border last:border-r-0",
                  viewFormat === fmt
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon size={13} />
                {FORMAT_LABELS[fmt]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content area — switches between the three view modes */}
      <div className="flex-1 overflow-hidden">
        {viewFormat === "interactive_map" && (
          <div className="p-4">
            <RoadmapFlow
              nodes={roadmap.nodes}
              edges={roadmap.edges}
              onNodeClick={handleNodeClick}
            />
          </div>
        )}
        {viewFormat === "steps" && (
          <div className="overflow-y-auto h-full">
            <StepsView nodes={roadmap.nodes} onNodeClick={handleNodeClick} />
          </div>
        )}
        {viewFormat === "schedule" && (
          <div className="overflow-y-auto h-full">
            <ScheduleView nodes={roadmap.nodes} hoursPerWeek={10} onNodeClick={handleNodeClick} />
          </div>
        )}
      </div>

      {/* Resource panel slides in from the right when a node is clicked */}
      <ResourcePanel resources={[]} criteria={[]} isLoading={false} />
    </div>
  );
}
