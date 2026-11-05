import type { components } from "../api/schema";

type Schemas = components["schemas"];

export type Project = Schemas["ProjectOut"];
export type ProjectUpdate = Schemas["ProjectUpdate"];
export type ProjectCreated = Schemas["ProjectCreated"];
export type Plane = Schemas["Plane"];
export type ScaleCheck = Schemas["ScaleCheck"];
export type Region = Schemas["Region"];
export type Design = Schemas["Design"];
export type Rates = Schemas["Rates"];
export type RegionType = Schemas["RegionType"];
export type Material = Schemas["Material"];
export type Category = Schemas["Category"];
export type Estimate = Schemas["Estimate"];
export type MaterialLine = Schemas["MaterialLine"];
export type TypeTotal = Schemas["TypeTotal"];
export type MaskData = Schemas["MaskData"];
export type JobStatus = Schemas["JobStatus"];
export type RenderStatus = Schemas["RenderStatus"];
export type QualityIssue = Schemas["QualityIssue"];

export type Point = [number, number];
export interface ImageSize {
  width: number;
  height: number;
}
