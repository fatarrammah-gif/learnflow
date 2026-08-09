import apiClient from "./client";
import type { SkillNode } from "@/types/roadmap";

export const nodesApi = {
  get: (nodeId: number) =>
    apiClient.get<SkillNode>(`/nodes/${nodeId}`).then((r) => r.data),

  // Flips is_completed to whatever it currently isn't.
  toggleComplete: (nodeId: number) =>
    apiClient
      .patch<{ is_completed: boolean }>(`/nodes/${nodeId}/complete`)
      .then((r) => r.data),
};
