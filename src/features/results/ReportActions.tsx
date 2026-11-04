import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { outputsApi } from "../../api/outputs";
import { Banner } from "../../components/ui/Banner";
import { Button } from "../../components/ui/Button";
import { downloadBlob } from "../../utils/download";

interface ReportActionsProps {
  projectId: string;
  designId: string;
}

export function ReportActions({ projectId, designId }: ReportActionsProps) {
  const [copied, setCopied] = useState(false);
  const download = useMutation({
    mutationFn: () => outputsApi.report(projectId, designId),
    onSuccess: (blob) => downloadBlob(blob, `renovation-estimate-${projectId.slice(0, 8)}.pdf`),
  });

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/projects/${projectId}/results`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="stack">
      <div className="row">
        <Button size="large" loading={download.isPending} onClick={() => download.mutate()}>
          ⬇ Download report (PDF)
        </Button>
        <Button variant="secondary" onClick={copyLink}>
          {copied ? "Link copied ✓" : "Copy project link"}
        </Button>
      </div>
      {download.isError && <Banner tone="error">{download.error.message}</Banner>}
      <p className="muted small">The report has your photos, materials, quantities and costs, ready to share with a contractor. Your project link lets you come back and edit later.</p>
    </div>
  );
}
