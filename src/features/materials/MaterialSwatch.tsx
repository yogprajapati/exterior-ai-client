import { catalogApi } from "../../api/catalog";
import type { Material } from "../../types";
import "./materials.css";

export function MaterialSwatch({ material }: { material: Material }) {
  const { render } = material;
  return render.texture ? (
    <img className="swatch" src={catalogApi.textureUrl(render.texture)} alt="" />
  ) : (
    <span className="swatch" style={{ background: render.color ?? undefined }} aria-hidden="true" />
  );
}
