import { Link, Outlet } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";
import { ServerWakeBanner } from "./ServerWakeBanner";

export function AppShell() {
  return (
    <>
      <ScrollToTop />
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="brand">
            🏠 Exterior Renovation Planner
          </Link>
          <nav className="row">
            <Link to="/examples" className="btn btn--ghost btn--small">
              Sample reports
            </Link>
            <Link to="/" className="btn btn--secondary btn--small">
              New project
            </Link>
          </nav>
        </div>
      </header>
      <main className="page stack">
        <ServerWakeBanner />
        <Outlet />
      </main>
    </>
  );
}
