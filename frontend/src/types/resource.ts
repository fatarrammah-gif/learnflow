export type MatchLevel = "high" | "medium" | "low";

export interface CriterionScore {
  criterion_id: number;
  score: number;
  match_level: MatchLevel;
  reasoning: string | null;
}

export interface VideoTimestamp {
  start_seconds: number;
  end_seconds: number | null;
  label: string;
  relevance_score: number;
}

export interface YoutubeResource {
  id: number;
  node_id: number;
  video_id: string;
  title: string;
  channel_name: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  youtube_url: string;
  overall_score: number;
  sort_rank: number;
  scores: CriterionScore[];
  timestamps: VideoTimestamp[];
}
