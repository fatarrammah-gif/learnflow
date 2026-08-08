import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoadmapStore } from "@/store/roadmapStore";
import { Flame, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ProgressPage — DataCamp-inspired learning dashboard.
// Shows greeting, streak, current roadmap progress, and per-skill breakdown.
// Progress bars animate in on mount using CSS transition.
export function ProgressPage() {
  const navigate = useNavigate();
  const { activeRoadmap } = useRoadmapStore();

  // Trigger progress bar animation after mount
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

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
          background: "linear-gradient(135deg, hsl(14 92% 58% / 0.12), hsl(38 38% 90%))",
          borderBottom: "1px solid hsl(36 26% 82%)",
        }}
      >
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Dashboard
            </p>
            <h1
              className="text-3xl font-bold text-foreground"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Ready to learn today?
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {totalCount > 0
                ? `${completedCount} of ${totalCount} skills completed · ${totalHours}h total roadmap`
                : "Complete onboarding to generate your first roadmap."}
            </p>
          </div>

          {/* Streak + XP badges */}
          <div className="flex gap-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
              <Flame size={16} className="text-orange-500" />
              <div>
                <div className="text-xs text-orange-600 font-semibold leading-none">Streak</div>
                <div
                  className="text-lg font-bold text-orange-600 leading-tight"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  3
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2">
              <Zap size={16} className="text-yellow-500" />
              <div>
                <div className="text-xs text-yellow-600 font-semibold leading-none">XP</div>
                <div
                  className="text-lg font-bold text-yellow-600 leading-tight"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  50
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">

        {/* ── Current roadmap card ── */}
        <section>
          <p
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Current roadmap
          </p>

          {activeRoadmap ? (
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div
                    className="font-bold text-base text-foreground leading-snug"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
                      className="text-sm font-semibold text-primary"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {overallPct}%
                    </span>
                  </div>

                  {/* Animated progress bar */}
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary progress-bar"
                      style={{ width: animated ? `${overallPct}%` : "0%" }}
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => navigate(`/roadmap/${activeRoadmap.id}`)}
                >
                  Keep going
                  <ArrowRight size={13} className="ml-1.5" />
                </Button>
              </div>
            </div>
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
              className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Progress by skill
            </p>
            <div className="bg-card rounded-xl border border-border divide-y divide-border overflow-hidden shadow-sm">
              {[...nodes]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((node) => (
                  <div key={node.id} className="flex items-center gap-4 px-5 py-3.5">
                    {/* Completion icon */}
                    {node.is_completed ? (
                      <CheckCircle2 size={16} className="text-primary shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium leading-snug",
                          node.is_completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {node.title}
                      </div>
                      {/* Mini progress bar */}
                      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden w-full">
                        <div
                          className="h-full rounded-full bg-primary progress-bar"
                          style={{
                            width: animated
                              ? node.is_completed
                                ? "100%"
                                : "0%"
                              : "0%",
                          }}
                        />
                      </div>
                    </div>

                    <span
                      className="text-[11px] text-primary/70 shrink-0"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {node.estimated_hours}h
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
