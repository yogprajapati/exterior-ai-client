import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { REFERENCES, referenceOf, type DraftPlane } from "./planeDraft";
import "./size.css";

interface PlanePanelProps {
  plane: DraftPlane;
  onChange: (patch: Partial<DraftPlane>) => void;
}

const sizeValue = (feet: number): string | number => feet || "";

/** The two things to do for one surface: choose what is being boxed (and its real size), then drag the box on the photo. */
export function PlanePanel({ plane, onChange }: PlanePanelProps) {
  const chosen = referenceOf(plane.heightFt);
  const drawn = plane.corners.length === 4;
  return (
    <div className="stack">
      <div className="stack">
        <strong>1. What will you draw a box around?</strong>
        <div className="choices" role="radiogroup" aria-label="What you will box">
          {REFERENCES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              role="radio"
              aria-checked={choice.id === chosen}
              className="choice"
              onClick={() => onChange({ heightFt: choice.heightFt })}
            >
              <span className="choice__label">{choice.label}</span>
              <span className="muted small">{choice.help}</span>
            </button>
          ))}
        </div>
        <Field label="How tall is it in real life (ft)?" hint="Standard heights are filled in. Use the real height if you know it: the more exact, the better the estimate.">
          <input className="input" type="number" min={0.1} step={0.1} value={sizeValue(plane.heightFt)} onChange={(e) => onChange({ heightFt: Number(e.target.value) })} />
        </Field>
      </div>

      <div className="stack">
        <strong>2. Drag a box around it on the photo</strong>
        <p className="muted small">
          {drawn
            ? "Box drawn. Drag a numbered corner if it needs adjusting."
            : "Press on one corner of it and drag to the opposite corner. Box only what you chose above."}
        </p>
        {drawn && (
          <Button size="small" variant="ghost" onClick={() => onChange({ corners: [] })}>
            Draw it again
          </Button>
        )}
      </div>

      <details className="more">
        <summary>Is this wall at a sharp angle in the photo?</summary>
        <label className="checkbox">
          <input type="checkbox" checked={plane.perspective} onChange={(e) => onChange({ perspective: e.target.checked })} />
          <span>
            Yes, it is photographed at an angle
            <span className="field__hint"> — then box something large on that wall, such as the whole wall, and enter its height and width.</span>
          </span>
        </label>
        {plane.perspective && (
          <Field label="Real width of what you boxed (ft)">
            <input className="input" type="number" min={0.1} step={0.1} value={sizeValue(plane.widthFt)} onChange={(e) => onChange({ widthFt: Number(e.target.value) })} />
          </Field>
        )}
      </details>
    </div>
  );
}
