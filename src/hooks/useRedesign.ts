import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { outputsApi } from "../api/outputs";
import { queryKeys } from "../api/queryKeys";
import { useObjectUrl } from "./useObjectUrl";

const POLL_MS = 2000;

/** The AI redesign of a design: starts on request, reports progress, and gives the finished image (for the current saved state only). */
export function useRedesign(projectId: string, designId: string, version: string, enabled: boolean) {
  const queryClient = useQueryClient();
  const statusKey = queryKeys.renderStatus(projectId, designId, version);
  const status = useQuery({
    queryKey: statusKey,
    queryFn: () => outputsApi.renderStatus(projectId, designId),
    enabled,
    refetchInterval: (query) => (query.state.data?.status === "running" ? POLL_MS : false),
  });
  const start = useMutation({
    mutationFn: () => outputsApi.startRender(projectId, designId),
    onSuccess: (job) => queryClient.setQueryData(statusKey, job),
  });
  const done = status.data?.status === "done";
  const image = useQuery({ queryKey: queryKeys.render(projectId, designId, version), queryFn: () => outputsApi.render(projectId, designId), enabled: enabled && done });

  const job = status.data;
  return {
    url: useObjectUrl(done ? image.data : undefined),
    running: start.isPending || job?.status === "running",
    progress: job?.progress ?? 0,
    label: job?.label ?? "",
    method: done ? job?.method : undefined,
    note: done ? job?.note : undefined,
    error: job?.error ?? start.error?.message ?? status.error?.message ?? image.error?.message ?? null,
    start: () => start.mutate(),
  };
}
