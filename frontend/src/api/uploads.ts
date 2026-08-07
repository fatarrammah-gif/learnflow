import apiClient from "./client";

export interface Upload {
  id: number;
  goal_id: number;
  upload_type: string;
  original_url: string | null;
  file_path: string | null;
  parsed_content: string | null;
}

export const uploadsApi = {
  uploadFile: (goalId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<Upload>(`/goals/${goalId}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  uploadUrl: (goalId: number, url: string) =>
    apiClient
      .post<Upload>(`/goals/${goalId}/uploads`, { url })
      .then((r) => r.data),

  list: (goalId: number) =>
    apiClient.get<Upload[]>(`/goals/${goalId}/uploads`).then((r) => r.data),

  delete: (goalId: number, uploadId: number) =>
    apiClient.delete(`/goals/${goalId}/uploads/${uploadId}`),
};
