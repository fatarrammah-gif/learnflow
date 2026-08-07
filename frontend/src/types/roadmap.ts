export type RoadmapFormat = "interactive_map" | "schedule" | "steps";
export type RoadmapStatus = "generating" | "ready" | "error" | "time_conflict";
export type TimeStrategy = "focus" | "extend" | "compromise";

export interface SkillNode {
  id: number;
  roadmap_id: number;
  title: string;
  description: string | null;
  category: string | null;
  estimated_hours: number;
  sort_order: number;
  position_x: number;
  position_y: number;
  is_completed: boolean;
  search_queries: string[] | null;
  key_concepts: string[] | null;
}

export interface NodeEdge {
  id: number;
  source_node_id: number;
  target_node_id: number;
}

export interface Roadmap {
  id: number;
  goal_id: number;
  output_format: RoadmapFormat;
  status: RoadmapStatus;
  time_conflict_strategy: string;
  total_hours_est: number | null;
  created_at: string;
  nodes: SkillNode[];
  edges: NodeEdge[];
}
