import { useServerWake } from "../hooks/useServerWake";
import { Banner } from "./ui/Banner";
import { Spinner } from "./ui/Spinner";

export function ServerWakeBanner() {
  const { isWaking } = useServerWake();
  if (!isWaking) return null;
  return (
    <Banner tone="info">
      <Spinner label="Waking up the server… the first visit can take up to a minute. Everything will work once this message disappears." />
    </Banner>
  );
}
