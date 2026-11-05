import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { Banner } from "../../components/ui/Banner";
import { Card } from "../../components/ui/Card";
import { useCreateProject } from "../../hooks/useProject";
import { lastProject } from "../../utils/storage";
import { DropZone } from "./DropZone";
import { Limitations } from "./Limitations";
import { SamplePhotos } from "./SamplePhotos";
import "./upload.css";

const TIPS = [
  "Stand back so the whole front of the house is in the picture.",
  "Take it in daylight, with the phone steady and in focus.",
  "Face the wall straight on, rather than from a sharp angle.",
];

export function UploadPage() {
  const navigate = useNavigate();
  const create = useCreateProject();
  const previousProject = lastProject.get();

  const upload = (file: File) =>
    create.mutate(file, {
      onSuccess: (project) => {
        lastProject.set(project.id);
        navigate(`/projects/${project.id}/size`, { state: { warnings: project.quality.issues } });
      },
    });

  const issues = create.error instanceof ApiError ? create.error.issues : [];

  return (
    <div className="upload stack">
      <div>
        <h1>See your house with new materials and know the cost</h1>
        <p className="muted">Upload a photo, pick paint, stone, tiles or railings, and get a quantity and cost estimate you can share with your contractor. <Link to="/examples">See sample reports</Link>.</p>
      </div>

      <DropZone onFile={upload} loading={create.isPending} />
      <SamplePhotos onFile={upload} disabled={create.isPending} />

      {create.isError && (
        <Banner tone="error">
          {issues.length > 1 ? (
            <ul>
              {issues.map((issue) => (
                <li key={issue.code}>{issue.message}</li>
              ))}
            </ul>
          ) : (
            create.error.message
          )}
        </Banner>
      )}

      {previousProject && (
        <Banner tone="info" action={<Link to={`/projects/${previousProject}/results`}>Continue</Link>}>
          You have a saved project on this device.
        </Banner>
      )}

      <Card title="For the best result">
        <ul className="upload__tips">
          {TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Card>

      <Limitations />
    </div>
  );
}
