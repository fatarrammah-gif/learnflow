import apiClient from "./client";
import type { Criterion, CriterionCreate, ReorderItem } from "@/types/criteria";

export const criteriaApi = {
  list: (goalId: number) =>
    apiClient.get<Criterion[]>(`/goals/${goalId}/criteria`).then((r) => r.data),

  create: (goalId: number, data: CriterionCreate) =>
    apiClient.post<Criterion>(`/goals/${goalId}/criteria`, data).then((r) => r.data),

  delete: (goalId: number, criterionId: number) =>
    apiClient.delete(`/goals/${goalId}/criteria/${criterionId}`),

  reorder: (goalId: number, items: ReorderItem[]) =>
    apiClient.post(`/goals/${goalId}/criteria/reorder`, { items }),
};
