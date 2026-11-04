import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { detectionApi } from "../../api/detection";
import { projectsApi } from "../../api/projects";
import { PhotoStage } from "../../components/PhotoStage";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { REGION_TYPES } from "../../config/regionTypes";
import { useMaskLayers } from "../../hooks/useMaskLayers";
import { useUpdateProject } from "../../hooks/useProject";
import type { Project, Region, RegionType } from "../../types";
import { newId } from "../../utils/id";
import { drawParts } from "./drawParts";
import { PartsList } from "./PartsList";
import { PartTypePicker } from "./PartTypePicker";
import { useOutline } from "./useOutline";
import "./parts.css";

/** Review the parts found automatically, fix or remove them, and add anything missing by name or by drawing around it. */
export function PartsEditor({ project, found }: { project: Project; found: Region[] }) {
  const navigate = useNavigate();
  const update = useUpdateProject(project.id);
  const size = useMemo(() => ({ width: project.width, height: project.height }), [project.width, project.height]);
  const outline = useOutline(size);

  const [regions, setRegions] = useState<Region[]>(project.regions.length ? project.regions : found);
  const [activeType, setActiveType] = useState<RegionType>("wall");
  const [planeId, setPlaneId] = useState(project.planes[0].id);
  const [phrase, setPhrase] = useState("");
  const [foundMessage, setFoundMessage] = useState<string | null>(null);

  const items = useMemo(() => regions.map((r) => ({ id: r.id, maskPng: r.mask_png, color: REGION_TYPES[r.type].color })), [regions]);
  const layers = useMaskLayers(items);
  const draw = useCallback((ctx: CanvasRenderingContext2D, ratio: number) => drawParts(ctx, ratio, layers.values(), outline.points), [layers, outline.points]);

  const find = useMutation({
    mutationFn: () => detectionApi.find(project.id, phrase.trim(), activeType),
    onSuccess: (found) => {
      setRegions((current) => [...current, ...found.map((r) => ({ ...r, plane_id: planeId }))]);
      setFoundMessage(found.length ? `Added ${found.length} ${REGION_TYPES[activeType].label.toLowerCase()} part${found.length > 1 ? "s" : ""}.` : `Nothing matching “${phrase.trim()}” was found.`);
    },
  });

  const addDrawn = () => setRegions((current) => [...current, { id: newId(), type: activeType, plane_id: planeId, mask_png: outline.take() }]);
  const changePart = (id: string, patch: Partial<Pick<Region, "type" | "plane_id">>) =>
    setRegions((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deletePart = (id: string) => setRegions((current) => current.filter((r) => r.id !== id));
  const save = () => update.mutate({ regions }, { onSuccess: () => navigate("../materials") });

  const { label, example } = REGION_TYPES[activeType];
  return (
    <div className="stack">
      <div className="step-title">
        <h1>Check the parts of your house</h1>
        <p className="muted">Fix any mistakes in the list. If something is missing, choose its type and either find it by name or draw around it.</p>
      </div>
      {found.length > 0 && project.regions.length === 0 && regions === found && (
        <Banner tone="success">We found {regions.length} parts automatically. They are coloured on the photo and listed on the right. Remove or relabel any that are wrong.</Banner>
      )}
      {find.isError && <Banner tone="error">{find.error.message}</Banner>}

      <div className="workspace">
        <PhotoStage src={projectsApi.imageUrl(project.id)} size={size} draw={draw} onPointerDown={outline.addPoint} busyLabel={find.isPending ? `Looking for “${phrase.trim()}”…` : undefined} />

        <div className="workspace__panel">
          <Card title="1. What is missing?">
            <PartTypePicker value={activeType} regions={regions} onChange={setActiveType} />
            {project.planes.length > 1 && (
              <label className="field" style={{ marginTop: "var(--space-3)" }}>
                <span className="field__label">It is on this surface</span>
                <select className="input" value={planeId} onChange={(e) => setPlaneId(e.target.value)}>
                  {project.planes.map((plane) => (
                    <option key={plane.id} value={plane.id}>
                      {plane.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </Card>

          <Card title="2. Find it by name, or draw it">
            <div className="stack">
              <form
                className="row"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFoundMessage(null);
                  find.mutate();
                }}
              >
                <input className="input" value={phrase} maxLength={60} placeholder={`e.g. ${example}`} aria-label={`Name of the ${label.toLowerCase()} to find`} onChange={(e) => setPhrase(e.target.value)} />
                <Button type="submit" size="small" disabled={phrase.trim() === ""} loading={find.isPending}>
                  Find all
                </Button>
              </form>
              {foundMessage && <p className="small">{foundMessage}</p>}
              <p className="small muted">Or click around the edge of the {label.toLowerCase()} on the photo to draw its outline, then press “Add outline”.</p>
              <div className="row">
                <Button size="small" disabled={!outline.canAdd} onClick={addDrawn}>
                  Add outline
                </Button>
                <Button size="small" variant="ghost" disabled={outline.points.length === 0} onClick={outline.undo}>
                  Undo
                </Button>
                <Button size="small" variant="ghost" disabled={outline.points.length === 0} onClick={outline.reset}>
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          <Card title={`Marked parts (${regions.length})`}>
            {regions.length ? <PartsList regions={regions} planes={project.planes} onChange={changePart} onDelete={deletePart} /> : <p className="muted small">Nothing marked yet.</p>}
          </Card>
        </div>
      </div>

      {regions.length > 0 && !regions.some((r) => r.type === "wall") && <Banner tone="info">Tip: mark at least one wall so we can measure and restyle it.</Banner>}
      {update.isError && <Banner tone="error">{update.error.message}</Banner>}

      <div className="step-actions">
        <Button variant="ghost" onClick={() => navigate("../size")}>
          ← Back
        </Button>
        <Button size="large" loading={update.isPending} disabled={regions.length === 0} onClick={save}>
          Save and continue
        </Button>
      </div>
    </div>
  );
}
