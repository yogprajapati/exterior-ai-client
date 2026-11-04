import { Card } from "../../components/ui/Card";
import { CATEGORY_LABELS } from "../../config/categories";
import type { Estimate } from "../../types";
import { formatInr } from "../../utils/format";
import "./results.css";

export function CostSummary({ estimate }: { estimate: Estimate }) {
  return (
    <Card title="Estimated cost">
      <div className="total">
        <span className="muted">Grand total</span>
        <strong className="total__amount">{formatInr(estimate.grand_total)}</strong>
        <span className="muted small">
          Likely range {formatInr(estimate.grand_total_low)} – {formatInr(estimate.grand_total_high)}
        </span>
      </div>
      <dl className="breakdown">
        <dt>Materials</dt>
        <dd>{formatInr(estimate.material_total)}</dd>
        <dt>Labour</dt>
        <dd>{formatInr(estimate.labor_total)}</dd>
      </dl>
      <h4 className="breakdown__heading">By category</h4>
      <dl className="breakdown">
        {estimate.categories.map((c) => (
          <div key={c.category} className="breakdown__row">
            <dt>{CATEGORY_LABELS[c.category]}</dt>
            <dd>{formatInr(c.total_cost)}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
