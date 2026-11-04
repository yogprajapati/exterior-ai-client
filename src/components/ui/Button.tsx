import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({ variant = "primary", size = "medium", loading = false, disabled, children, className = "", ...rest }: ButtonProps) {
  const classes = ["btn", `btn--${variant}`, size !== "medium" && `btn--${size}`, className].filter(Boolean).join(" ");
  return (
    <button type="button" className={classes} disabled={disabled || loading} {...rest}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}
