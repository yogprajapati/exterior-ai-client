import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../components/ProjectLayout";
import { QueryBoundary } from "../../components/QueryBoundary";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Tabs } from "../../components/ui/Tabs";
import { useEstimate } from "../../hooks/useEstimate";
import { useUpdateProject } from "../../hooks/useProject";
import type { Rates } from "../../types";
import { isStyled } from "../materials/designs";
import { DesignView } from "../redesign/DesignView";
import { CostSummary } from "./CostSummary";
import { EstimateTable } from "./EstimateTable";
import { MeasurementsCard } from "./MeasurementsCard";
import { ReportActions } from "./ReportActions";
import "./results.css";

export function ResultsStep() {
  const project = useProjectContext();
  const navigate = useNavigate();
  const update = useUpdateProject(project.id);

  const designs = project.designs.filter(isStyled);
  const [activeId, setActiveId] = useState(designs[0]?.id ?? "");
  const estimate = useEstimate(project.id, activeId, project.updated_at);

  if (designs.length === 0) {
    return (
      <Banner tone="info" action={<Button size="small" onClick={() => navigate("../materials")}>Choose materials</Button>}>
        Pick materials for at least one part to see your estimate.
      </Banner>
    );
  }

  const changeRates = (materialId: string, rates: Rates) => update.mutate({ rates: { ...project.rates, [materialId]: rates } });
  const resetRates = (materialId: string) => {
    const { [materialId]: _removed, ...rest } = project.rates;
    update.mutate({ rates: rest });
  };
  const recalculating = update.isPending || estimate.isFetching;

  return (
    <div className="stack">
      <div className="step-title">
        <h1>Your renovation estimate</h1>
        <p className="muted">Drag the slider to compare. You can change any rate below and the costs update straight away.</p>
      </div>

      <Tabs tabs={designs.map((d) => ({ id: d.id, label: d.name }))} activeId={activeId} onChange={setActiveId} />

      <div className="workspace">
        <div className="stack">
          <DesignView project={project} designId={activeId} saved />
        </div>

        <QueryBoundary query={estimate} loadingLabel="Calculating costs…">
          {(data) => (
            <div className="workspace__panel">
              <CostSummary estimate={data} />
              <MeasurementsCard totals={data.type_totals} />
            </div>
          )}
        </QueryBoundary>
      </div>

      <QueryBoundary query={estimate} loadingLabel="Calculating costs…">
        {(data) => (
          <Card title="Quantities and cost">
            <div className="stack">
              {recalculating && <Spinner label="Recalculating…" />}
              {update.isError && <Banner tone="error">{update.error.message}</Banner>}
              <EstimateTable lines={data.lines} edited={new Set(Object.keys(project.rates))} onRatesChange={changeRates} onRatesReset={resetRates} />
              <p className="muted small">Rates are planning assumptions in rupees, not quotations. Change them to match your local prices. This estimate is advisory only.</p>
            </div>
          </Card>
        )}
      </QueryBoundary>

      <ReportActions projectId={project.id} designId={activeId} />

      <div className="step-actions">
        <Button variant="ghost" onClick={() => navigate("../materials")}>
          ← Change materials
        </Button>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Start a new project
        </Button>
      </div>
    </div>
  );
}
