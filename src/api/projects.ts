import type { Plane, Project, ProjectCreated, ProjectUpdate, ScaleCheck } from "../types";
import { apiUrl, http } from "./client";

export const projectsApi = {
  create(file: File): Promise<ProjectCreated> {
    const form = new FormData();
    form.append("file", file);
    return http.json<ProjectCreated>("/api/projects", { method: "POST", body: form });
  },
  get: (id: string): Promise<Project> => http.json<Project>(`/api/projects/${id}`),
  update: (id: string, changes: ProjectUpdate): Promise<Project> => http.sendJson<Project>("PATCH", `/api/projects/${id}`, changes),
  scaleCheck: (id: string, plane: Plane): Promise<ScaleCheck> => http.sendJson<ScaleCheck>("POST", `/api/projects/${id}/scale-check`, plane),
  imageUrl: (id: string): string => apiUrl(`/api/projects/${id}/image`),
};
