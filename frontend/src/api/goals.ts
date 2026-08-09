import apiClient from "./client";
import type { Goal, GoalCreate } from "@/types/goal";

export const goalsApi = {
  create: (data: GoalCreate) =>
    apiClient.post<Goal>("/goals/", data).then((r) => r.data),

  get: (id: number) =>
    apiClient.get<Goal>(`/goals/${id}`).then((r) => r.data),

  list: () =>
    apiClient.get<Goal[]>("/goals/").then((r) => r.data),
};
