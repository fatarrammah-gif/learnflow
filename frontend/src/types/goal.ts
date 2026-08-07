export type Level = "beginner" | "intermediate" | "expert";

export interface Goal {
  id: number;
  title: string;
  level: Level;
  topic_focus: string | null;
  skills_tools: string[];
  time_weeks: number;
  hours_per_week: number;
  created_at: string;
  updated_at: string;
}

export interface GoalCreate {
  title: string;
  level: Level;
  topic_focus: string;
  skills_tools: string[];
  time_weeks: number;
  hours_per_week: number;
}
