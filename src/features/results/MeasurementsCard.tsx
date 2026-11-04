import { Card } from "../../components/ui/Card";
import { REGION_TYPES } from "../../config/regionTypes";
import type { TypeTotal } from "../../types";
import { formatNumber } from "../../utils/format";
import "./results.css";

export function MeasurementsCard({ totals }: { totals: TypeTotal[] }) {
  return (
    <Card title="What we measured">
      <table className="measure">
        <tbody>
          {totals.map((row) => (
            <tr key={row.type}>
              <th scope="row">
                {REGION_TYPES[row.type].label}
                {row.count > 1 ? ` (${row.count})` : ""}
              </th>
              <td>
                {formatNumber(row.area_sqft)} sq ft
                <span className="muted small"> likely {formatNumber(row.area_low)}–{formatNumber(row.area_high)}</span>
                {row.length_ft != null && <div className="muted small">Running length {formatNumber(row.length_ft)} ft</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="muted small">Windows and doors are left out of wall areas. Photo measurements are approximate, so treat these as planning figures.</p>
    </Card>
  );
}
