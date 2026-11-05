import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs } from "../../components/ui/Tabs";
import "./examples.css";

const REPORTS = [
  { id: "apartment", label: "Apartment block", file: "sample-report-apartment.pdf", summary: "Window frames, wall paint, aluminium railings and a gate." },
  { id: "villa", label: "Villa", file: "sample-report-villa.pdf", summary: "Wall paint, aluminium window frames and a veneer door." },
  { id: "house", label: "Gabled house", file: "sample-report-house.pdf", summary: "Wall paint and frosted privacy glass." },
];

export function ExamplesPage() {
  const [activeId, setActiveId] = useState(REPORTS[0].id);
  const report = REPORTS.find((r) => r.id === activeId) ?? REPORTS[0];
  const url = `/samples/${report.file}`;

  return (
    <div className="examples stack">
      <div>
        <h1>Sample reports</h1>
        <p className="muted">
          Finished reports made from sample photos: before and after, materials, quantities, cost breakdown and how the numbers were derived. Rates as of 5 Nov 2026.
        </p>
      </div>

      <Tabs tabs={REPORTS.map(({ id, label }) => ({ id, label }))} activeId={activeId} onChange={setActiveId} />

      <p>{report.summary}</p>
      <object className="examples__viewer" data={url} type="application/pdf" aria-label={`${report.label} sample report`}>
        <p>Your browser cannot show the report here.</p>
      </object>
      <div className="row">
        <a className="btn btn--secondary btn--small" href={url} target="_blank" rel="noreferrer">
          Open in a new tab
        </a>
        <a className="btn btn--secondary btn--small" href={url} download>
          Download PDF
        </a>
        <Link className="btn btn--primary btn--small" to="/">
          Try with your photo
        </Link>
      </div>
    </div>
  );
}
