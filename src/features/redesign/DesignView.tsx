import { projectsApi } from "../../api/projects";
import { BeforeAfter } from "../../components/BeforeAfter";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { usePreviewImage } from "../../hooks/usePreviewImage";
import { useRedesign } from "../../hooks/useRedesign";
import type { Project } from "../../types";

interface DesignViewProps {
  project: Project;
  designId: string;
  /** False while the design has unsaved changes: the server can only draw what it has saved. */
  saved: boolean;
}

/** Before/after of a design: the instant preview, replaced by the realistic AI redesign once it has been created. */
export function DesignView({ project, designId, saved }: DesignViewProps) {
  const preview = usePreviewImage(project.id, designId, project.updated_at, saved);
  const redesign = useRedesign(project.id, designId, project.updated_at, saved);
  const size = { width: project.width, height: project.height };

  return (
    <div className="stack">
      {(!saved || preview.isFetching) && !redesign.running && <Spinner label="Updating preview…" />}
      <BeforeAfter before={projectsApi.imageUrl(project.id)} after={redesign.url ?? preview.url} size={size} afterLabel={redesign.url && redesign.method === "ai" ? "Realistic redesign" : "Quick preview"} />
      {preview.error && <Banner tone="error">{preview.error.message}</Banner>}

      {redesign.running ? (
        <div className="stack">
          <Spinner label={`${redesign.label || "Redesigning your house"}…`} />
          <progress value={redesign.progress} max={1} aria-label="Redesign progress" style={{ width: "100%" }} />
        </div>
      ) : (
        redesign.method !== "ai" && (
          <Banner tone={redesign.note ? "warning" : "info"} action={<Button size="small" disabled={!saved} onClick={redesign.start}>{redesign.note ? "Try again" : "Create realistic redesign"}</Button>}>
            {redesign.note ?? "This is a quick recolour preview. The realistic redesign repaints the house in the real texture and light of your photo, and takes about a minute."}
          </Banner>
        )
      )}
      {redesign.error && <Banner tone="error">{redesign.error}</Banner>}
    </div>
  );
}
