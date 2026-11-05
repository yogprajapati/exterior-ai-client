import { Button } from "../../components/ui/Button";

interface ShapeToolsProps {
  hasSelection: boolean;
  canErase: boolean;
  busy: boolean;
  onGrow: () => void;
  onShrink: () => void;
  onErase: () => void;
}

export function ShapeTools({ hasSelection, canErase, busy, onGrow, onShrink, onErase }: ShapeToolsProps) {
  return (
    <div className="stack">
      <p className="small muted">
        {hasSelection
          ? "The selected part is highlighted. Make its outline bigger or smaller, or draw around an area on the photo and cut it out."
          : "Choose a part in the list below to fix its outline."}
      </p>
      <div className="row">
        <Button size="small" variant="secondary" disabled={!hasSelection || busy} onClick={onGrow}>
          Make bigger
        </Button>
        <Button size="small" variant="secondary" disabled={!hasSelection || busy} onClick={onShrink}>
          Make smaller
        </Button>
        <Button size="small" variant="secondary" disabled={!hasSelection || !canErase || busy} onClick={onErase}>
          Cut out drawn area
        </Button>
      </div>
    </div>
  );
}
