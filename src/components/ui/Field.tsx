import { useId, type ReactElement, cloneElement } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactElement<{ id?: string }>;
}

export function Field({ label, hint, children }: FieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {cloneElement(children, { id })}
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}
