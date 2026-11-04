import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../api/projects";
import { queryKeys } from "../api/queryKeys";
import type { ProjectUpdate } from "../types";

export const useProject = (id: string) => useQuery({ queryKey: queryKeys.project(id), queryFn: () => projectsApi.get(id), staleTime: Infinity });

/** Saves a partial change; the server's response replaces the cached project, so every screen stays in sync. */
export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (changes: ProjectUpdate) => projectsApi.update(id, changes),
    onSuccess: (project) => queryClient.setQueryData(queryKeys.project(id), project),
  });
}

export const useCreateProject = () => useMutation({ mutationFn: (file: File) => projectsApi.create(file) });
