import { Button } from "../../components/ui/Button";
import type { MaterialLine, Rates } from "../../types";
import { formatInr, formatNumber } from "../../utils/format";
import { RateCell } from "./RateCell";
import "./results.css";

interface EstimateTableProps {
  lines: MaterialLine[];
  edited: ReadonlySet<string>;
  onRatesChange: (materialId: string, rates: Rates) => void;
  onRatesReset: (materialId: string) => void;
}

interface CostRowProps {
  label: string;
  rateLabel: string;
  rate: number;
  perUnit: string;
  quantity: number;
  cost: number;
  onCommit: (rate: number) => void;
}

/** One cost: editable rate × quantity = cost, so the arithmetic is visible. */
function CostRow({ label, rateLabel, rate, perUnit, quantity, cost, onCommit }: CostRowProps) {
  return (
    <tr>
      <th scope="row">{label}</th>
      <td>
        <RateCell label={rateLabel} value={rate} onCommit={onCommit} />
        <span className="muted small"> per {perUnit}</span>
      </td>
      <td>
        × {formatNumber(quantity)} {perUnit}
      </td>
      <td>
        <strong>{formatInr(cost)}</strong>
      </td>
    </tr>
  );
}

function LineBreakdown({ line, edited, onRatesChange, onRatesReset }: { line: MaterialLine; edited: boolean } & Omit<EstimateTableProps, "lines" | "edited">) {
  const rates: Rates = { material_rate: line.material_rate, prep_rate: line.prep_rate, labor_rate: line.labor_rate };
  const change = (patch: Partial<Rates>) => onRatesChange(line.material_id, { ...rates, ...patch });
  const wastage = line.wastage_pct ? ` (includes ${line.wastage_pct}% wastage)` : "";
  return (
    <article className="cost-line">
      <header className="cost-line__head">
        <h4>{line.name}</h4>
        <strong>{formatInr(line.total_cost)}</strong>
      </header>
      <p className="muted small">
        Measured {formatNumber(line.measured)} {line.measured_unit}. Order {formatNumber(line.quantity)} {line.quantity_unit}
        {wastage}.
      </p>
      <div className="table-scroll">
        <table className="estimate">
          <tbody>
            <CostRow label="Material" rateLabel={`${line.name} material rate per ${line.quantity_unit}`} rate={line.material_rate} perUnit={line.quantity_unit} quantity={line.quantity} cost={line.material_cost} onCommit={(material_rate) => change({ material_rate })} />
            <CostRow label="Preparation and fixing" rateLabel={`${line.name} preparation rate per ${line.measured_unit}`} rate={line.prep_rate} perUnit={line.measured_unit} quantity={line.measured} cost={line.prep_cost} onCommit={(prep_rate) => change({ prep_rate })} />
            <CostRow label="Labour" rateLabel={`${line.name} labour rate per ${line.measured_unit}`} rate={line.labor_rate} perUnit={line.measured_unit} quantity={line.measured} cost={line.labor_cost} onCommit={(labor_rate) => change({ labor_rate })} />
          </tbody>
        </table>
      </div>
      {edited && (
        <Button size="small" variant="ghost" onClick={() => onRatesReset(line.material_id)}>
          Reset rates
        </Button>
      )}
    </article>
  );
}

export function EstimateTable({ lines, edited, onRatesChange, onRatesReset }: EstimateTableProps) {
  return (
    <div className="stack">
      {lines.map((line) => (
        <LineBreakdown key={line.material_id} line={line} edited={edited.has(line.material_id)} onRatesChange={onRatesChange} onRatesReset={onRatesReset} />
      ))}
    </div>
  );
}
