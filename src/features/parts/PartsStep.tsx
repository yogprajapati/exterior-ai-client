import { useProjectContext } from "../../components/ProjectLayout";
import { Banner } from "../../components/ui/Banner";
import { Spinner } from "../../components/ui/Spinner";
import { useDetection } from "../../hooks/useDetection";
import { PartsEditor } from "./PartsEditor";

/** Finds the parts of the house automatically (or shows the saved ones), then opens the editor to check them. */
export function PartsStep() {
  const project = useProjectContext();
  const detection = useDetection(project);

  if (!detection.ready) {
    return (
      <div className="stack">
        <Spinner block label={`${detection.label}… this takes a couple of minutes the first time.`} />
        <progress value={detection.progress} max={1} aria-label="Detection progress" style={{ width: "100%" }} />
      </div>
    );
  }
  const notice = detection.failed
    ? `We couldn't find the parts automatically${detection.error ? ` (${detection.error})` : ""}. Please mark them yourself with "Find by name" or "Draw outline".`
    : detection.note;
  return (
    <>
      {notice && <Banner tone="warning">{notice}</Banner>}
      <PartsEditor project={project} found={detection.found} />
    </>
  );
}
