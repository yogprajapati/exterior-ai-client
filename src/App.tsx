import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProjectLayout } from "./components/ProjectLayout";
import { ExamplesPage } from "./features/examples/ExamplesPage";
import { MaterialsStep } from "./features/materials/MaterialsStep";
import { PartsStep } from "./features/parts/PartsStep";
import { ResultsStep } from "./features/results/ResultsStep";
import { SizeStep } from "./features/size/SizeStep";
import { UploadPage } from "./features/upload/UploadPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<UploadPage />} />
        <Route path="examples" element={<ExamplesPage />} />
        <Route path="projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Navigate to="size" replace />} />
          <Route path="size" element={<SizeStep />} />
          <Route path="parts" element={<PartsStep />} />
          <Route path="materials" element={<MaterialsStep />} />
          <Route path="results" element={<ResultsStep />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
