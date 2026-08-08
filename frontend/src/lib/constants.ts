// Default criteria shown to users at setup — they can reorder/delete/add
export const DEFAULT_CRITERIA = [
  { label: "Theory Clearness", description: "How clearly the video explains the underlying theory" },
  { label: "Implementation", description: "How well the video demonstrates real code and practice" },
  { label: "Deepness", description: "How thoroughly the topic is covered beyond the basics" },
  { label: "Completeness", description: "Whether the video covers a full solution including many skills" },
  { label: "Briefness", description: "How efficiently the video delivers value without filler" },
];

// Skill level options
export const LEVELS = [
  { value: "beginner", label: "Beginner", description: "New to this topic" },
  { value: "intermediate", label: "Intermediate", description: "Some experience" },
  { value: "expert", label: "Expert", description: "Advanced topics only" },
] as const;

// Colors for match level chips on resource cards — dark-mode safe
export const MATCH_LEVEL_STYLES: Record<string, string> = {
  high: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  low: "bg-red-500/15 text-red-400 border border-red-500/30",
};

// Roadmap format options shown to users
export const ROADMAP_FORMATS = [
  { value: "interactive_map", label: "Interactive Map", description: "Visual node graph with connections" },
  { value: "schedule", label: "Weekly Schedule", description: "Calendar showing when to study each topic" },
  { value: "steps", label: "Step-by-Step List", description: "Ordered steps with estimated time" },
] as const;

// API base URL — in production this should be your Railway backend URL
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "";
