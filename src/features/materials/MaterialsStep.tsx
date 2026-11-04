import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../components/ProjectLayout";
import { QueryBoundary } from "../../components/QueryBoundary";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Tabs } from "../../components/ui/Tabs";
import { useCatalog } from "../../hooks/useCatalog";
import { useDebouncedEffect } from "../../hooks/useDebouncedEffect";
import { useUpdateProject } from "../../hooks/useProject";
import type { Design } from "../../types";
import { newId } from "../../utils/id";
import { DesignView } from "../redesign/DesignView";
import { assignMaterial, emptyDesign, hasAssignments, nextDesignName } from "./designs";
import { PartsMaterials } from "./PartsMaterials";
import "./materials.css";

const AUTOSAVE_DELAY_MS = 600;

export function MaterialsStep() {
  const project = useProjectContext();
  const navigate = useNavigate();
  const catalog = useCatalog();
  const update = useUpdateProject(project.id);

  const [designs, setDesigns] = useState<Design[]>(() => (project.designs.length ? project.designs : [emptyDesign(newId(), "Design A")]));
  const [activeId, setActiveId] = useState(designs[0].id);
  const [revision, setRevision] = useState(0);
  const [savedRevision, setSavedRevision] = useState(0);
  const unsaved = revision !== savedRevision;
  const design = designs.find((d) => d.id === activeId)!;

  const edit = (change: (current: Design[]) => Design[]) => {
    setDesigns(change);
    setRevision((r) => r + 1);
  };
  const editActive = (change: (d: Design) => Design) => edit((current) => current.map((d) => (d.id === activeId ? change(d) : d)));

  const save = () => update.mutate({ designs }, { onSuccess: () => setSavedRevision(revision) });
  // Leaving the step within the autosave delay must not lose the last change
  const latest = useRef({ designs, unsaved });
  latest.current = { designs, unsaved };
  useEffect(
    () => () => {
      if (latest.current.unsaved) update.mutate({ designs: latest.current.designs });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useDebouncedEffect(() => unsaved && save(), [revision], AUTOSAVE_DELAY_MS);

  const addDesign = () => {
    const created = emptyDesign(newId(), nextDesignName(designs));
    edit((current) => [...current, created]);
    setActiveId(created.id);
  };
  const removeDesign = () => {
    const remaining = designs.filter((d) => d.id !== activeId);
    edit(() => remaining);
    setActiveId(remaining[0].id);
  };

  const savedOnServer = project.designs.some((d) => d.id === activeId);

  return (
    <div className="stack">
      <div className="step-title">
        <h1>Choose materials</h1>
        <p className="muted">Pick a material for each part and watch your house change. Create several designs to compare, such as a stone look and a painted look.</p>
      </div>

      <div className="design-bar">
        <Tabs tabs={designs.map((d) => ({ id: d.id, label: d.name }))} activeId={activeId} onChange={setActiveId} onAdd={addDesign} addLabel="+ New design" />
        <div className="row">
          <Field label="Design name">
            <input className="input" value={design.name} onChange={(e) => editActive((d) => ({ ...d, name: e.target.value }))} />
          </Field>
          {designs.length > 1 && (
            <Button size="small" variant="danger" onClick={removeDesign}>
              Delete design
            </Button>
          )}
        </div>
      </div>

      <div className="workspace">
        <div className="stack">
          <DesignView project={project} designId={activeId} saved={savedOnServer && !unsaved && !update.isPending} />
        </div>

        <div className="workspace__panel">
          <Card title="Parts you can restyle">
            <QueryBoundary query={catalog} loadingLabel="Loading materials…">
              {(materials) =>
                project.regions.some((r) => materials.some((m) => m.applies_to.includes(r.type))) ? (
                  <PartsMaterials
                    regions={project.regions}
                    catalog={materials}
                    design={design}
                    onAssign={(regionIds, materialId, slot) => editActive((d) => assignMaterial(d, regionIds, materialId, slot))}
                  />
                ) : (
                  <Banner tone="info">None of your marked parts can be restyled. Go back and mark walls, railings or pillars.</Banner>
                )
              }
            </QueryBoundary>
          </Card>
        </div>
      </div>

      {update.isError && (
        <Banner tone="error" action={<Button size="small" variant="secondary" onClick={save}>Try again</Button>}>
          Your changes could not be saved. {update.error.message}
        </Banner>
      )}

      <div className="step-actions">
        <Button variant="ghost" onClick={() => navigate("../parts")}>
          ← Back
        </Button>
        <Button size="large" disabled={!hasAssignments(designs) || unsaved || update.isPending} onClick={() => navigate("../results")}>
          See cost estimate
        </Button>
      </div>
    </div>
  );
}
