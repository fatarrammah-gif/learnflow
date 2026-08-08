import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "./ResourceCard";
import { useRoadmapStore } from "@/store/roadmapStore";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import type { YoutubeResource } from "@/types/resource";
import type { Criterion } from "@/types/criteria";

interface Props {
  resources: YoutubeResource[];
  criteria: Criterion[];
  isLoading: boolean;
}

// ResourcePanel — a drawer that slides in from the right when the user clicks a skill node
// It shows the top YouTube videos for that specific skill topic
export function ResourcePanel({ resources, criteria, isLoading }: Props) {
  const { isPanelOpen, setPanelOpen, getSelectedNode } = useRoadmapStore();
  const node = getSelectedNode();  // Get the currently selected skill node from the store

  // Don't render anything if no node is selected
  if (!isPanelOpen) return null;

  return (
    <>
      {/* Backdrop — clicking outside the panel closes it */}
      <div className="fixed inset-0 bg-black/10 z-40" onClick={() => setPanelOpen(false)} />

      {/* The actual panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold">{node?.title ?? "Resources"}</h2>
            <p className="text-xs text-muted-foreground">{node?.category} · ~{node?.estimated_hours}h</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setPanelOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        {/* Scrollable resource list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3 text-muted-foreground">
              <Loader2 className="animate-spin" size={24} />
              <p className="text-sm">Finding best resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No resources yet. Click "Fetch Resources" to search YouTube for this topic.
            </div>
          ) : (
            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {resources.map((r) => (
                <motion.div key={r.id} variants={fadeInUp}>
                  <ResourceCard resource={r} criteria={criteria} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
