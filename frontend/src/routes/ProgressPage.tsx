import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRoadmapStore } from "@/store/roadmapStore";
import { ArrowRight, CheckCircle2, Map, TrendingUp } from "lucide-react";
import { Button, MotionButton } from "@/components/ui/button";
import { Card, MotionCard } from "@/components/ui/card";
import { StreakXpBadge } from "@/components/layout/StreakXpBadge";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";

// ProgressPage — DataCamp-inspired learning dashboard.
// Shows greeting, streak, current roadmap progress, and per-skill breakdown.
// Progress bars and the skill list animate in on mount via framer-motion.
export function ProgressPage() {
  const navigate = useNavigate();
  const { activeRoadmap } = useRoadmapStore();

  // Compute overall progress from the active roadmap in the store
  const nodes = activeRoadmap?.nodes ?? [];
  const completedCount = nodes.filter((n) => n.is_completed).length;
  const totalCount = nodes.length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const totalHours = nodes.reduce((s, n) => s + n.estimated_hours, 0);

  return (
    <div className="min-h-full">
      {/* ── Header band — coral gradient greeting ── */}
      <div
        className="px-8 py-8"
        style={{
          background: "linear-gradient(135deg, hsl(340 82% 52% / 0.12), hsl(38 38% 90%))",
          borderBottom: "1px solid hsl(36 26% 82%)",
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 font-display"
            >
              Dashboard
            </p>
            <h1
              className="text-3xl font-bold text-foreground font-display"
            >
              Ready to learn today?
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {totalCount > 0
                ? `${completedCount} of ${totalCount} skills completed · ${totalHours}h total roadmap`
                : "Complete onboarding to generate your first roadmap."}
            </p>
          </div>

          <StreakXpBadge streak={3} xp={50} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">

        {/* ── Current roadmap card ── */}
        <section>
          <p
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 font-display"
          >
            <Map size={12} className="text-primary" />
            Current roadmap
          </p>

          {activeRoadmap ? (
            <Card variant="elevated" className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div
                    className="font-bold text-base text-foreground leading-snug font-display"
                  >
                    {activeRoadmap.nodes[0]?.title
                      ? `${totalCount}-skill learning path`
                      : "Your roadmap"}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {completedCount}/{totalCount} skills
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span
                      className="text-sm font-semibold text-primary font-mono"
                    >
                      {overallPct}%
                    </span>
                  </div>

                  {/* Animated progress bar */}
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${overallPct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    />
                  </div>
                </div>

                <MotionButton
                  size="sm"
                  className="shrink-0"
                  onClick={() => navigate(`/roadmap/${activeRoadmap.id}`)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Keep going
                  <ArrowRight size={13} className="ml-1.5" />
                </MotionButton>
              </div>
            </Card>
          ) : (
            <div className="bg-card rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">No active roadmap yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate("/")}
              >
                Create a goal →
              </Button>
            </div>
          )}
        </section>

        {/* ── Per-skill progress breakdown ── */}
        {nodes.length > 0 && (
          <section>
            <p
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3 font-display"
            >
              <TrendingUp size={12} className="text-primary" />
              Progress by skill
            </p>
            <MotionCard
              variant="elevated"
              className="divide-y divide-border"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[...nodes]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((node) => (
                  <motion.div
                    key={node.id}
                    variants={fadeInUp}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    {/* Completion icon */}
                    {node.is_completed ? (
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium leading-snug font-display",
                          node.is_completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                      >
                        {node.title}
                      </div>
                      {/* Mini progress bar */}
                      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden w-full">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: node.is_completed ? "100%" : "0%" }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                        />
                      </div>
                    </div>

                    <span
                      className="text-[11px] text-primary/70 shrink-0 font-mono"
                    >
                      {node.estimated_hours}h
                    </span>
                  </motion.div>
                ))}
            </MotionCard>
          </section>
        )}
      </div>
    </div>
  );
}
