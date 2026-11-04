import { NavLink } from "react-router-dom";
import { STEPS } from "../config/steps";

interface StepperProps {
  projectId: string;
  reachable: number;
}

export function Stepper({ projectId, reachable }: StepperProps) {
  return (
    <nav aria-label="Steps">
      <ol className="stepper">
        {STEPS.map((step, index) => (
          <li key={step.id} className="stepper__item">
            {index <= reachable ? (
              <NavLink to={`/projects/${projectId}/${step.id}`} className={({ isActive }) => `stepper__link${isActive ? " stepper__link--active" : ""}`}>
                <span className="stepper__number">{index + 1}</span>
                {step.label}
              </NavLink>
            ) : (
              <span className="stepper__link stepper__link--locked" aria-disabled="true">
                <span className="stepper__number">{index + 1}</span>
                {step.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
