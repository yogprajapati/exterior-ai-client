import { useState } from "react";
import "./results.css";

interface RateCellProps {
  label: string;
  value: number;
  onCommit: (value: number) => void;
}

/** A rate the user can edit; the change is applied when they leave the field or press Enter. */
export function RateCell({ label, value, onCommit }: RateCellProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = () => {
    const parsed = Number(draft);
    if (draft !== null && draft !== "" && Number.isFinite(parsed) && parsed >= 0 && parsed !== value) onCommit(parsed);
    setDraft(null);
  };

  return (
    <input
      className="input rate-input"
      type="number"
      min={0}
      aria-label={label}
      value={draft ?? value}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
    />
  );
}
