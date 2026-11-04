import { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { projectsApi } from "../../api/projects";
import { PhotoStage } from "../../components/PhotoStage";
import { useProjectContext } from "../../components/ProjectLayout";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { DEFAULT_PLANE_ID } from "../../config/steps";
import { useDetection } from "../../hooks/useDetection";
import { useUpdateProject } from "../../hooks/useProject";
import { useScaleCheck } from "../../hooks/useScaleCheck";
import type { Point, QualityIssue } from "../../types";
import { newId } from "../../utils/id";
import { errorMessage } from "../../api/client";
import { drawPlanes } from "./drawPlanes";
import { PlanePanel } from "./PlanePanel";
import { isComplete, isTinyBox, newPlane, rectangleCorners, toDraft, toPlane, type DraftPlane } from "./planeDraft";
import { ScaleSummary } from "./ScaleSummary";
import "./size.css";

const HANDLE_GRAB_RADIUS = 28;

type Drag = { kind: "corner"; index: number } | { kind: "box"; anchor: Point };

export function SizeStep() {
  const project = useProjectContext();
  const navigate = useNavigate();
  const update = useUpdateProject(project.id);
  useDetection(project); // starts finding the parts while the user sets the size
  const warnings: QualityIssue[] = useLocation().state?.warnings ?? [];

  const [planes, setPlanes] = useState<DraftPlane[]>(() => (project.planes.length ? project.planes.map(toDraft) : [newPlane(DEFAULT_PLANE_ID, "Main wall")]));
  const [activeId, setActiveId] = useState(planes[0].id);
  const drag = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState(false); // the box is only checked once the user lets go
  const active = planes.find((p) => p.id === activeId)!;
  const usedByParts = project.regions.some((r) => r.plane_id === activeId);
  const complete = isComplete(active);
  const scale = useScaleCheck(project.id, useMemo(() => (complete && !dragging ? toPlane(active) : null), [active, complete, dragging]));

  const patchActive = useCallback((patch: Partial<DraftPlane>) => setPlanes((all) => all.map((p) => (p.id === activeId ? { ...p, ...patch } : p))), [activeId]);

  const handlePointerDown = (point: Point, pixelRatio: number) => {
    if (active.corners.length < 4) {
      drag.current = { kind: "box", anchor: point };
    } else {
      const distances = active.corners.map(([x, y]) => Math.hypot(x - point[0], y - point[1]));
      const nearest = distances.indexOf(Math.min(...distances));
      drag.current = distances[nearest] <= HANDLE_GRAB_RADIUS * pixelRatio ? { kind: "corner", index: nearest } : null;
    }
    setDragging(drag.current !== null);
  };

  const handlePointerMove = (point: Point) => {
    const current = drag.current;
    if (!current) return;
    if (current.kind === "box") patchActive({ corners: rectangleCorners(current.anchor, point) });
    else patchActive({ corners: active.corners.map((corner, i) => (i === current.index ? point : corner)) });
  };

  const handlePointerUp = () => {
    drag.current = null;
    setDragging(false);
    if (isTinyBox(active.corners)) patchActive({ corners: [] }); // a plain click, not a drag
  };

  const addSurface = () => {
    const surface = newPlane(newId(), `Surface ${planes.length + 1}`);
    setPlanes([...planes, surface]);
    setActiveId(surface.id);
  };

  const removeActive = () => {
    const remaining = planes.filter((p) => p.id !== activeId);
    setPlanes(remaining);
    setActiveId(remaining[0].id);
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D, ratio: number) => drawPlanes(ctx, planes, activeId, ratio), [planes, activeId]);

  const save = () => update.mutate({ planes: planes.map(toPlane) }, { onSuccess: () => navigate("../parts") });
  const blocked = !planes.every(isComplete) || Boolean(scale.data?.issue);

  return (
    <div className="stack">
      <div className="step-title">
        <h1>Give your photo a scale</h1>
        <p className="muted">
          A photo does not show how big things are. Pick something on your house whose size you know, such as a door, and draw a box around it. From that we work out the size of every wall,
          window and railing, and from those the paint, material and cost.
        </p>
      </div>

      {warnings.length > 0 && (
        <Banner tone="warning">
          <ul>
            {warnings.map((w) => (
              <li key={w.code}>{w.message}</li>
            ))}
          </ul>
        </Banner>
      )}

      <div className="workspace">
        <PhotoStage
          src={projectsApi.imageUrl(project.id)}
          size={{ width: project.width, height: project.height }}
          draw={draw}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />

        <div className="workspace__panel">
          <Card title={planes.length > 1 ? "Surfaces" : "Your reference"}>
            <div className="stack">
              {planes.length > 1 && <Tabs tabs={planes.map((p) => ({ id: p.id, label: p.name }))} activeId={activeId} onChange={setActiveId} />}
              <PlanePanel plane={active} onChange={patchActive} />
              <ScaleSummary missing={active.corners.length < 4 ? "box" : complete ? null : "size"} checking={scale.isFetching} check={scale.data} error={scale.isError ? errorMessage(scale.error) : null} />
              <details className="more">
                <summary>How is this used?</summary>
                <p className="muted small">
                  The box tells us how many feet one pixel of the photo is. Every part you mark is measured in pixels and converted to square feet. Quantities add wastage and coverage per
                  litre or piece, and cost is quantity times the rate, plus labour. The size you enter is therefore the one number that scales every result.
                </p>
              </details>
              <details className="more">
                <summary>Walls at different angles or depths?</summary>
                <p className="muted small">Most houses need just one box. If part of the house is a different wall, such as a side wall or a balcony that sticks out, add another surface and box something on it.</p>
                <div className="row">
                  <Button size="small" variant="secondary" onClick={addSurface}>
                    + Add another surface
                  </Button>
                  {planes.length > 1 && !usedByParts && (
                    <Button size="small" variant="danger" onClick={removeActive}>
                      Remove this surface
                    </Button>
                  )}
                </div>
              </details>
            </div>
          </Card>
        </div>
      </div>

      {update.isError && <Banner tone="error">{update.error.message}</Banner>}

      <div className="step-actions step-actions--end">
        {blocked && !scale.data?.issue && <span className="muted small">Draw the box and enter its real height to continue.</span>}
        <Button size="large" loading={update.isPending} disabled={blocked} onClick={save}>
          Save and continue
        </Button>
      </div>
    </div>
  );
}
