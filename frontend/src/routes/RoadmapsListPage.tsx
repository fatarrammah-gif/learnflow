import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Map, Calendar, List, ArrowRight, Compass } from "lucide-react";
import { roadmapsApi } from "@/api/roadmaps";
import { MotionCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { staggerContainer, fadeInUp, cardHover } from "@/lib/motion";
import type { RoadmapFormat, RoadmapStatus } from "@/types/roadmap";

const FORMAT_ICONS: Record<RoadmapFormat, typeof Map> = {
  interactive_map: Map,
  schedule: Calendar,
  steps: List,
};

const FORMAT_LABELS: Record<RoadmapFormat, string> = {
  interactive_map: "Map",
  schedule: "Schedule",
  steps: "Steps",
};

const STATUS_STYLES: Record<RoadmapStatus, string> = {
  ready: "bg-green-50 text-green-700 border-green-200",
  generating: "bg-primary-soft text-primary-soft-foreground border-primary/20",
  error: "bg-red-50 text-red-700 border-red-200",
  time_conflict: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

// RoadmapsListPage — "My Roadmaps" dashboard.
// Every roadmap the user has generated, across every goal, as cards.
export function RoadmapsListPage() {
  const navigate = useNavigate();
  const { data: roadmaps, isLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: () => roadmapsApi.list(),
  });

  return (
    <div className="min-h-full p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 font-display">
          <Compass size={12} className="text-primary" />
          Learn
        </p>
        <h1 className="text-3xl font-bold text-foreground font-display">My Roadmaps</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Every learning path you've generated, in one place.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-sm text-muted-foreground">Loading roadmaps...</div>
      ) : !roadmaps || roadmaps.length === 0 ? (
        <div className="bg-card rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground text-sm mb-3">No roadmaps yet.</p>
          <Button size="sm" onClick={() => navigate("/")}>
            Create your first goal →
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {roadmaps.map((roadmap) => {
            const FormatIcon = FORMAT_ICONS[roadmap.output_format];
            return (
              <motion.div key={roadmap.id} variants={fadeInUp}>
                <MotionCard
                  variant="elevated"
                  className="p-5 cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                  {...cardHover}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-bold text-base text-foreground leading-snug font-display line-clamp-2">
                      {roadmap.goal_title ?? "Untitled goal"}
                    </h2>
                    <span
                      className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${STATUS_STYLES[roadmap.status]}`}
                    >
                      {roadmap.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FormatIcon size={12} />
                      {FORMAT_LABELS[roadmap.output_format]}
                    </span>
                    <span>·</span>
                    <span>{roadmap.node_count ?? 0} skills</span>
                    {roadmap.total_hours_est != null && (
                      <>
                        <span>·</span>
                        <span className="font-mono text-primary/80">{roadmap.total_hours_est}h</span>
                      </>
                    )}
                  </div>

                  <div className="flex-1" />

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(roadmap.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      View <ArrowRight size={12} />
                    </span>
                  </div>
                </MotionCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
