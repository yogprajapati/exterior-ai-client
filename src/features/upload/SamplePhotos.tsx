import { Button } from "../../components/ui/Button";

const SAMPLES = [
  { file: "apartment.jpg", label: "Apartment block" },
  { file: "villa.jpg", label: "Villa" },
];

interface SamplePhotosProps {
  onFile: (file: File) => void;
  disabled: boolean;
}

export function SamplePhotos({ onFile, disabled }: SamplePhotosProps) {
  const pick = async (file: string) => {
    const blob = await (await fetch(`/samples/${file}`)).blob();
    onFile(new File([blob], file, { type: blob.type }));
  };

  return (
    <div className="row">
      <span className="muted">No photo handy? Try a sample:</span>
      {SAMPLES.map(({ file, label }) => (
        <Button key={file} variant="secondary" size="small" disabled={disabled} onClick={() => pick(file)}>
          {label}
        </Button>
      ))}
    </div>
  );
}
