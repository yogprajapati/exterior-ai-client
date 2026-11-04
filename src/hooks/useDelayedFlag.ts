import { useEffect, useState } from "react";

/** True only once `active` has stayed true for `delayMs`, so quick operations never flash a loader. */
export function useDelayedFlag(active: boolean, delayMs = 1500): boolean {
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    if (!active) {
      setDelayed(false);
      return;
    }
    const timer = setTimeout(() => setDelayed(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);
  return delayed;
}
