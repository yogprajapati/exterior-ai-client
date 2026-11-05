import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { detectionApi } from "../api/detection";
import { queryKeys } from "../api/queryKeys";
import type { Project } from "../types";

const POLL_MS = 1500;

export function useDetection(project: Project) {
  const queryClient = useQueryClient();
  const needed = project.regions.length === 0;
  const statusKey = queryKeys.detection(project.id);

  const status = useQuery({
    queryKey: statusKey,
    queryFn: () => detectionApi.status(project.id),
    enabled: needed,
    refetchInterval: (query) => (query.state.data?.status === "running" || query.state.data?.status === "idle" ? POLL_MS : false),
    retry: false,
  });
  const start = useMutation({
    mutationFn: () => detectionApi.start(project.id),
    onSuccess: (job) => queryClient.setQueryData(statusKey, job),
  });

  const state = status.data?.status;
  useEffect(() => {
    if (needed && state === "idle" && start.isIdle) start.mutate();
  }, [needed, state, start]);

  const parts = useQuery({ queryKey: queryKeys.detectedParts(project.id), queryFn: () => detectionApi.parts(project.id), enabled: needed && state === "done", staleTime: Infinity });

  const failed = state === "failed" || status.isError || start.isError || parts.isError;
  return {
    ready: !needed || parts.isSuccess || failed,
    failed,
    error: status.data?.error ?? (start.error ?? status.error ?? parts.error)?.message ?? null,
    progress: status.data?.progress ?? 0,
    label: status.data?.label ?? "Starting",
    note: status.data?.note ?? null,
    found: parts.data ?? [],
  };
}
