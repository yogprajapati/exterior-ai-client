import type { ReactNode } from "react";

type Tone = "info" | "warning" | "error" | "success";

interface BannerProps {
  tone?: Tone;
  children: ReactNode;
  action?: ReactNode;
}

export function Banner({ tone = "info", children, action }: BannerProps) {
  return (
    <div className={`banner banner--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <div>{children}</div>
      {action}
    </div>
  );
}
