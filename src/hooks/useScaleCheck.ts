import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { projectsApi } from "../api/projects";
import { queryKeys } from "../api/queryKeys";
import type { Plane } from "../types";

/** What the reference box implies for the whole photo; asks the server (the only place sizes are calculated) once the box is complete. */
export const useScaleCheck = (projectId: string, plane: Plane | null) =>
  useQuery({
    queryKey: queryKeys.scale(projectId, plane),
    queryFn: () => projectsApi.scaleCheck(projectId, plane!),
    enabled: plane !== null,
    placeholderData: keepPreviousData,
    retry: false,
  });
