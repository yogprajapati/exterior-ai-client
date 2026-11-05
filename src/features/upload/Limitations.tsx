import { Card } from "../../components/ui/Card";

const LIMITATIONS = [
  "Areas are measured from one photo, so they are approximate (usually within 5 to 15%). Thin parts such as pillars are less exact, and surfaces at a different depth need their own reference box.",
  "Only visible faces are measured. Unseen sides, returns and balcony undersides are not counted.",
  "Automatic part detection is not perfect: gates, garages and parapets can be missed, and a neighbour's wall can be counted as yours. Review the list, find missing parts by name or outline them by hand.",
  "The instant preview recolours your photo. The realistic redesign is made by a free AI image editor, so textures are plausible but not at measured scale, and it can be unavailable when the free daily quota runs out. The preview is shown instead.",
  "The first request can take up to a minute while the free server wakes up, and detection of a new photo takes longer on free hosting.",
  "Rates and wastage are planning defaults and you can edit them. Estimates are advisory, not a quotation. Exterior of low-rise homes only, one photo per project.",
];

export function Limitations() {
  return (
    <Card title="Good to know">
      <ul className="upload__list">
        {LIMITATIONS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
