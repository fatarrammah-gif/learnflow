import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { roadmapsApi } from "@/api/roadmaps";
import { criteriaApi } from "@/api/criteria";
import { nodesApi } from "@/api/nodes";
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
  const queryClient = useQueryClient();

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

  // Criteria belong to the goal, not the roadmap — fetch once we know the goal_id
  const { data: criteria } = useQuery({
    queryKey: ["criteria", roadmap?.goal_id],
    queryFn: () => criteriaApi.list(roadmap!.goal_id),
    enabled: !!roadmap,
  });

  // When data arrives, push it into the global roadmap store so other components can read it
  // useEffect runs after the render whenever `roadmap` changes
  useEffect(() => {
    if (roadmap) setRoadmap(roadmap);
  }, [roadmap, setRoadmap]);

  const toggleComplete = useMutation({
    mutationFn: (nodeId: number) => nodesApi.toggleComplete(nodeId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["roadmap", roadmapId] }),
  });

  const handleNodeClick = (nodeId: number) => {
    selectNode(nodeId);  // Opens the ResourcePanel for this node
  };

  const handleToggleComplete = (nodeId: number) => {
    toggleComplete.mutate(nodeId);
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-baseline gap-3">
          <h1
            className="font-bold text-base font-display"
          >
            Your roadmap
          </h1>
          <span className="text-xs text-muted-foreground">
            {roadmap.nodes.length} skills ·{" "}
            <span
              className="text-primary font-medium font-mono"
            >
              {roadmap.total_hours_est}h
            </span>
          </span>
        </div>

        {/* Segmented format switcher — coral active state */}
        <div className="flex border border-border rounded-lg overflow-hidden bg-muted/50">
          {(["interactive_map", "schedule", "steps"] as RoadmapFormat[]).map((fmt) => {
            const Icon = FORMAT_ICONS[fmt];
            return (
              <motion.button
                key={fmt}
                onClick={() => setViewFormat(fmt)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm transition-colors border-r border-border last:border-r-0",
                  viewFormat === fmt
                    ? "bg-white text-primary font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                )}
              >
                <Icon size={13} />
                {FORMAT_LABELS[fmt]}
              </motion.button>
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
              onToggleComplete={handleToggleComplete}
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
      <ResourcePanel criteria={criteria ?? []} isLoading={false} />
    </div>
  );
}
