export interface Criterion {
  id: number;
  goal_id: number;
  label: string;
  description: string | null;
  sort_order: number;
  is_custom: boolean;
  created_at: string;
}

export interface CriterionCreate {
  label: string;
  description?: string;
  sort_order: number;
  is_custom?: boolean;
}

export interface ReorderItem {
  id: number;
  sort_order: number;
}
