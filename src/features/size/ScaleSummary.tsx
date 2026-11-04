import { Banner } from "../../components/ui/Banner";
import { Spinner } from "../../components/ui/Spinner";
import type { ScaleCheck } from "../../types";
import "./size.css";

interface ScaleSummaryProps {
  /** What is still missing before the scale can be checked, if anything. */
  missing: "box" | "size" | null;
  checking: boolean;
  check: ScaleCheck | undefined;
  error: string | null;
}

/** Feedback on the box just drawn: what size it makes the whole photo, or why it cannot be right. */
export function ScaleSummary({ missing, checking, check, error }: ScaleSummaryProps) {
  if (missing === "size") return <Banner tone="warning">Now type how tall what you boxed is in real life (in feet), above. Then you can continue.</Banner>;
  if (missing === "box") return <p className="muted small">Once the box is drawn and its real height entered, we will show here how big your photo comes out in real feet.</p>;
  if (error) return <Banner tone="error">{error}</Banner>;
  if (!check) return <Spinner label="Checking the size…" />;
  if (check.issue) return <Banner tone="error">{check.issue}</Banner>;
  return (
    <Banner tone="success">
      <strong>Scale set.</strong> The photo covers about {Math.round(check.photo_width_ft)} ft across and {Math.round(check.photo_height_ft)} ft top to bottom.
      {checking && " Updating…"} Does that look right for your house? If not, change the size or redraw the box.
    </Banner>
  );
}
