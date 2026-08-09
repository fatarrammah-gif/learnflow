import { X, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CriteriaTag } from "@/components/resources/CriteriaTag";
import { buildMockResourcePreview } from "@/lib/mockResourcePreview";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { SkillNode } from "@/types/roadmap";

interface Props {
  node: SkillNode;
  onClose: () => void;
}

// StepPreviewModal — a small MOCK preview of what a step's best resource card
// will look like once the real YouTube + Gemini pipeline exists. All data
// here is placeholder (see lib/mockResourcePreview.ts) — this intentionally
// does NOT touch roadmapStore or ResourcePanel, which stay wired to real
// (currently empty) backend data for later.
export function StepPreviewModal({ node, onClose }: Props) {
  const preview = buildMockResourcePreview(node);

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-card rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4 border max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wide font-semibold text-primary/70">
              Example preview · mock data
            </span>
            <h3 className="font-semibold text-sm mt-0.5 leading-snug font-display">{node.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mock thumbnail */}
        <div
          className="h-24 rounded-lg relative flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${preview.thumbnailColors[0]}, ${preview.thumbnailColors[1]})`,
          }}
        >
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            <Youtube size={10} /> YouTube
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
            {preview.durationLabel}
          </div>
        </div>

        {/* Title + channel */}
        <div>
          <p className="text-sm font-medium leading-snug line-clamp-2">{preview.videoTitle}</p>
          <p className="text-xs text-muted-foreground mt-1">{preview.channelName}</p>
        </div>

        {/* Criteria match ratio */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Match with your criteria</span>
            <span className="text-sm font-mono font-semibold text-primary">
              {preview.strongCount}/{preview.criteriaScores.length} strong
            </span>
          </div>
          <div className="flex gap-0.5">
            {preview.criteriaScores.map((c) => (
              <div
                key={c.label}
                title={`${c.label}: ${c.matchLevel}`}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  c.matchLevel === "high" && "bg-green-500",
                  c.matchLevel === "medium" && "bg-amber-500",
                  c.matchLevel === "low" && "bg-red-400"
                )}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {preview.criteriaScores.map((c) => (
              <CriteriaTag key={c.label} label={c.label} matchLevel={c.matchLevel} score={c.score} />
            ))}
          </div>
        </div>

        {/* Tools used — from the step's key concepts */}
        <div>
          <span className="text-xs font-medium text-muted-foreground">Tools used in implementation</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {preview.tags.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </div>

        {/* Concept vs implementation focus */}
        <div>
          <span className="text-xs font-medium text-muted-foreground">Most focused on</span>
          <div className="flex h-2 rounded-full overflow-hidden mt-1.5">
            <div className="bg-sky-300" style={{ width: `${preview.focus.conceptPercent}%` }} />
            <div className="bg-primary/60" style={{ width: `${preview.focus.implementationPercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Concept</span>
            <span>Implementation</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 font-mono">
            {preview.focus.mostFocused.label} ·{" "}
            {preview.focus.mostFocused.kind === "implementation" ? "Hands-on coding" : "Concept explanation"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
