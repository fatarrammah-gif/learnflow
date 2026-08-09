// MOCK DATA — placeholder until the real YouTube search + Gemini transcript
// scoring pipeline exists. Everything here is deterministic (seeded off the
// real node's id/title/category/hours/key_concepts) so a given step always
// shows the same preview and doesn't flicker on re-render, but it is NOT
// real analysis — just a stand-in so the UI can be previewed end-to-end.
import { DEFAULT_CRITERIA } from "./constants";
import type { SkillNode } from "@/types/roadmap";

export type MockMatchLevel = "high" | "medium" | "low";

export interface MockCriterionPreview {
  label: string;
  matchLevel: MockMatchLevel;
  score: number; // 0-1
}

export interface MockResourcePreview {
  videoTitle: string;
  channelName: string;
  durationLabel: string;
  thumbnailColors: [string, string];
  criteriaScores: MockCriterionPreview[];
  strongCount: number;
  tags: string[];
  focus: {
    conceptPercent: number;
    implementationPercent: number;
    mostFocused: { kind: "concept" | "implementation"; label: string };
  };
}

// A stable 0..1 value from an integer seed — NOT real randomness, just a
// cheap way to vary the mock output per node without it changing on re-render.
function seeded(seed: number): number {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

const VIDEO_TITLE_TEMPLATES = [
  (title: string) => `Complete Guide to ${title}`,
  (title: string) => `${title} — Full Tutorial`,
  (title: string) => `Learn ${title} in 20 Minutes`,
  (title: string) => `${title}: Hands-on Walkthrough`,
];

const CHANNEL_NAMES = ["CodeWithAda", "DevSimplified", "TechMentor", "The Code Report", "ML Explained"];

const THUMBNAIL_HUES: Record<string, [string, string]> = {
  Foundations: ["#BFDBFE", "#3B82F6"],
  "Core Concepts": ["#DDD6FE", "#8B5CF6"],
  Advanced: ["#FED7AA", "#F97316"],
  Projects: ["#BBF7D0", "#16A34A"],
};

// A fixed match-level pattern, rotated per node so most previews look
// encouraging (~4/5 strong) but vary from node to node.
const MATCH_PATTERN: MockMatchLevel[] = ["high", "high", "medium", "high", "low"];

function formatMinutes(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function buildMockResourcePreview(node: SkillNode): MockResourcePreview {
  const seed = node.id;
  const template = VIDEO_TITLE_TEMPLATES[seed % VIDEO_TITLE_TEMPLATES.length];
  const channelName = CHANNEL_NAMES[Math.floor(seeded(seed + 1) * CHANNEL_NAMES.length)];
  const thumbnailColors = THUMBNAIL_HUES[node.category ?? ""] ?? ["#E5E7EB", "#9CA3AF"];

  const durationMinutes = Math.min(48, Math.max(8, Math.round(node.estimated_hours * 6)));
  const durationSeconds = durationMinutes * 60 + Math.floor(seeded(seed + 2) * 60);
  const durationLabel = formatMinutes(durationSeconds);

  // Score ranges match the real threshold rule used elsewhere in the app
  // (score_transcript: >=0.7 high, >=0.4 medium, else low) so a mock "high"
  // tag never shows a percentage that would actually read as medium/low.
  const rotation = seed % MATCH_PATTERN.length;
  const criteriaScores: MockCriterionPreview[] = DEFAULT_CRITERIA.map((c, i) => {
    const matchLevel = MATCH_PATTERN[(i + rotation) % MATCH_PATTERN.length];
    const [min, max] = matchLevel === "high" ? [0.7, 0.98] : matchLevel === "medium" ? [0.4, 0.69] : [0.1, 0.39];
    const score = min + seeded(seed + 10 + i) * (max - min);
    return { label: c.label, matchLevel, score: Math.round(score * 100) / 100 };
  });
  const strongCount = criteriaScores.filter((c) => c.matchLevel === "high").length;

  const tags =
    node.key_concepts && node.key_concepts.length > 0
      ? node.key_concepts.slice(0, 5)
      : ["fundamentals", "hands-on practice"];

  const conceptPercent = Math.round(30 + seeded(seed + 20) * 30); // 30-60
  const implementationPercent = 100 - conceptPercent;
  const focusKind: "concept" | "implementation" =
    node.category === "Projects" ? "implementation" : node.category === "Foundations" || node.category === "Core Concepts" ? "concept" : seeded(seed + 21) > 0.5 ? "implementation" : "concept";
  const focusStart = Math.round(durationMinutes * seeded(seed + 22) * 0.4);
  const focusEnd = Math.min(durationMinutes, focusStart + Math.round(durationMinutes * 0.25));

  return {
    videoTitle: template(node.title),
    channelName,
    durationLabel,
    thumbnailColors,
    criteriaScores,
    strongCount,
    tags,
    focus: {
      conceptPercent,
      implementationPercent,
      mostFocused: {
        kind: focusKind,
        label: `${focusStart}:00–${focusEnd}:00`,
      },
    },
  };
}
