import apiClient from "./client";
import type { Roadmap, RoadmapFormat, TimeStrategy } from "@/types/roadmap";

export const roadmapsApi = {
  generate: (goalId: number, outputFormat: RoadmapFormat) =>
    apiClient
      .post<{ roadmap_id: number; status: string }>(`/goals/${goalId}/roadmaps/generate`, {
        output_format: outputFormat,
      })
      .then((r) => r.data),

  get: (roadmapId: number) =>
    apiClient.get<Roadmap>(`/roadmaps/${roadmapId}`).then((r) => r.data),

  resolveTime: (roadmapId: number, strategy: TimeStrategy) =>
    apiClient
      .post<{ roadmap_id: number; status: string }>(`/roadmaps/${roadmapId}/resolve-time`, { strategy })
      .then((r) => r.data),
};
