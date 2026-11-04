interface SpinnerProps {
  label?: string;
  block?: boolean;
}

export function Spinner({ label, block = false }: SpinnerProps) {
  return (
    <span className={block ? "spinner spinner--block" : "spinner"} role="status" aria-live="polite">
      {label ?? <span className="visually-hidden">Loading</span>}
    </span>
  );
}
