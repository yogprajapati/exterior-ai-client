import { useState, type DragEvent } from "react";
import { Spinner } from "../../components/ui/Spinner";
import "./upload.css";

interface DropZoneProps {
  onFile: (file: File) => void;
  loading: boolean;
}

export function DropZone({ onFile, loading }: DropZoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) onFile(file);
  };

  return (
    <label
      className={`dropzone${dragging ? " dropzone--active" : ""}`}
      onDragOver={(e) => (e.preventDefault(), setDragging(true))}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="visually-hidden"
        disabled={loading}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      {loading ? (
        <Spinner label="Checking your photo…" />
      ) : (
        <>
          <span className="dropzone__icon" aria-hidden="true">
            📷
          </span>
          <strong>Choose a photo of your house</strong>
          <span className="muted">or drag it here · JPG, PNG or WebP</span>
        </>
      )}
    </label>
  );
}
