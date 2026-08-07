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

// Colors for match level chips on resource cards
export const MATCH_LEVEL_STYLES: Record<string, string> = {
  high: "bg-green-100 text-green-800 border border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  low: "bg-red-100 text-red-800 border border-red-200",
};

// Roadmap format options shown to users
export const ROADMAP_FORMATS = [
  { value: "interactive_map", label: "Interactive Map", description: "Visual node graph with connections" },
  { value: "schedule", label: "Weekly Schedule", description: "Calendar showing when to study each topic" },
  { value: "steps", label: "Step-by-Step List", description: "Ordered steps with estimated time" },
] as const;

// API base URL — in production this should be your Railway backend URL
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "";
