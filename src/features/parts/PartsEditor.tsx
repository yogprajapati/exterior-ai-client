import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { detectionApi } from "../../api/detection";
import { masksApi } from "../../api/masks";
import { projectsApi } from "../../api/projects";
import { PhotoStage } from "../../components/PhotoStage";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { REGION_TYPES } from "../../config/regionTypes";
import { useMaskLayers } from "../../hooks/useMaskLayers";
import { useUpdateProject } from "../../hooks/useProject";
import type { MaskData, Project, Region, RegionType } from "../../types";
import { newId } from "../../utils/id";
import { drawParts } from "./drawParts";
import { PartsList } from "./PartsList";
import { PartTypePicker } from "./PartTypePicker";
import { ShapeTools } from "./ShapeTools";
import { useOutline } from "./useOutline";
import { useRegions } from "./useRegions";
import "./parts.css";

const RESHAPE_PX = 6;

interface PartsEditorProps {
  project: Project;
  found: Region[];
}

export function PartsEditor({ project, found }: PartsEditorProps) {
  const navigate = useNavigate();
  const update = useUpdateProject(project.id);
  const size = useMemo(() => ({ width: project.width, height: project.height }), [project.width, project.height]);
  const outline = useOutline(size);
  const edits = useRegions(project.regions.length ? project.regions : found.map((part) => ({ ...part, plane_id: project.planes[0].id })));

  const [activeType, setActiveType] = useState<RegionType>("wall");
  const [planeId, setPlaneId] = useState(project.planes[0].id);
  const [phrase, setPhrase] = useState("");
  const [foundMessage, setFoundMessage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(() => edits.regions.map((r) => ({ id: r.id, maskPng: r.mask_png, color: REGION_TYPES[r.type].color })), [edits.regions]);
  const layers = useMaskLayers(items);
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, ratio: number) => drawParts(ctx, ratio, { layers, selectedId, outline: outline.points }),
    [layers, selectedId, outline.points],
  );

  const find = useMutation({
    mutationFn: () => detectionApi.find(project.id, phrase.trim(), activeType),
    onSuccess: (parts) => {
      edits.add(parts.map((part) => ({ ...part, plane_id: planeId })));
      const label = REGION_TYPES[activeType].label.toLowerCase();
      setFoundMessage(parts.length ? `Added ${parts.length} ${label} part${parts.length > 1 ? "s" : ""}.` : `Nothing matching “${phrase.trim()}” was found.`);
    },
  });

  const reshape = useMutation({
    mutationFn: async (change: (maskPng: string) => Promise<MaskData>) => {
      const part = edits.regions.find((region) => region.id === selectedId)!;
      return { id: part.id, maskPng: (await change(part.mask_png)).mask_png };
    },
    onSuccess: ({ id, maskPng }) => edits.update(id, { mask_png: maskPng }),
  });

  const removePart = (id: string) => {
    if (id === selectedId) setSelectedId(null);
    edits.remove(id);
  };
  const addDrawn = () => edits.add([{ id: newId(), type: activeType, plane_id: planeId, mask_png: outline.take() }]);
  const save = () => update.mutate({ regions: edits.regions }, { onSuccess: () => navigate("../materials") });

  const { label, example } = REGION_TYPES[activeType];
  const showFoundBanner = found.length > 0 && project.regions.length === 0;

  return (
    <div className="stack">
      <div className="step-title">
        <h1>Check the parts of your house</h1>
        <p className="muted">Fix any mistakes in the list. If something is missing, choose its type and either find it by name or draw around it.</p>
      </div>
      {showFoundBanner && <Banner tone="success">We found {found.length} parts automatically. They are coloured on the photo and listed on the right. Remove or relabel any that are wrong.</Banner>}
      {find.isError && <Banner tone="error">{find.error.message}</Banner>}
      {reshape.isError && <Banner tone="error">{reshape.error.message}</Banner>}

      <div className="workspace">
        <PhotoStage src={projectsApi.imageUrl(project.id)} size={size} draw={draw} onPointerDown={outline.addPoint} busyLabel={find.isPending ? `Looking for “${phrase.trim()}”…` : undefined} />

        <div className="workspace__panel">
          <Card title="1. What is missing?">
            <PartTypePicker value={activeType} regions={edits.regions} onChange={setActiveType} />
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

          <Card title="3. Fix an outline">
            <ShapeTools
              hasSelection={selectedId !== null}
              canErase={outline.canAdd}
              busy={reshape.isPending}
              onGrow={() => reshape.mutate((mask) => masksApi.grow(mask, RESHAPE_PX))}
              onShrink={() => reshape.mutate((mask) => masksApi.grow(mask, -RESHAPE_PX))}
              onErase={() => reshape.mutate((mask) => masksApi.erase(mask, outline.toMask()), { onSuccess: outline.reset })}
            />
          </Card>

          <Card title={`Marked parts (${edits.regions.length})`}>
            <div className="stack">
              {edits.canUndoRemove && (
                <Button size="small" variant="secondary" onClick={edits.undoRemove}>
                  Undo remove
                </Button>
              )}
              {edits.regions.length ? (
                <PartsList regions={edits.regions} planes={project.planes} selectedId={selectedId} onSelect={setSelectedId} onChange={edits.update} onDelete={removePart} />
              ) : (
                <p className="muted small">Nothing marked yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {edits.regions.length > 0 && !edits.regions.some((r) => r.type === "wall") && <Banner tone="info">Tip: mark at least one wall so we can measure and restyle it.</Banner>}
      {update.isError && <Banner tone="error">{update.error.message}</Banner>}

      <div className="step-actions">
        <Button variant="ghost" onClick={() => navigate("../size")}>
          ← Back
        </Button>
        <Button size="large" loading={update.isPending} disabled={edits.regions.length === 0} onClick={save}>
          Save and continue
        </Button>
      </div>
    </div>
  );
}
