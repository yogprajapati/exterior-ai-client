import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { errorMessage } from "../api/client";
import { Banner } from "./ui/Banner";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";

interface QueryBoundaryProps<T> {
  query: UseQueryResult<T>;
  loadingLabel?: string;
  children: (data: T) => ReactNode;
}

/** Shows a loader, or a retryable error, until the query has data; then renders its children. */
export function QueryBoundary<T>({ query, loadingLabel = "Loading…", children }: QueryBoundaryProps<T>) {
  if (query.isPending) return <Spinner block label={loadingLabel} />;
  if (query.isError) {
    return (
      <Banner
        tone="error"
        action={
          <Button size="small" variant="secondary" onClick={() => query.refetch()}>
            Try again
          </Button>
        }
      >
        {errorMessage(query.error)}
      </Banner>
    );
  }
  return <>{children(query.data)}</>;
}
