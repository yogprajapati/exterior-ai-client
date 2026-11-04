import { useEffect, type DependencyList } from "react";

export function useDebouncedEffect(effect: () => void, deps: DependencyList, delayMs: number): void {
  useEffect(() => {
    const timer = setTimeout(effect, delayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delayMs]);
}
