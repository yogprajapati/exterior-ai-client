import { Navigate, Outlet, useLocation, useOutletContext, useParams } from "react-router-dom";
import { STEPS } from "../config/steps";
import { useProject } from "../hooks/useProject";
import type { Project } from "../types";
import { reachableStepIndex } from "../utils/progress";
import { QueryBoundary } from "./QueryBoundary";
import { Stepper } from "./Stepper";

/** Loads the project once and shares it with every step through the router's outlet context. */
export function ProjectLayout() {
  const { projectId = "" } = useParams();
  const query = useProject(projectId);
  const { pathname } = useLocation();
  return (
    <QueryBoundary query={query} loadingLabel="Opening your project…">
      {(project) => {
        const reachable = reachableStepIndex(project);
        const requested = STEPS.findIndex((step) => pathname.endsWith(`/${step.id}`));
        // a link to a step this project is not ready for (e.g. a bookmark) goes to the furthest step it can open
        if (requested > reachable) return <Navigate to={`/projects/${projectId}/${STEPS[reachable].id}`} replace />;
        return (
          <>
            <Stepper projectId={projectId} reachable={reachable} />
            <Outlet context={project} />
          </>
        );
      }}
    </QueryBoundary>
  );
}

export const useProjectContext = (): Project => useOutletContext<Project>();
