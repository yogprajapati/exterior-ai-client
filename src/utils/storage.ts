const LAST_PROJECT_KEY = "exterior:last-project";

export const lastProject = {
  get(): string | null {
    try {
      return localStorage.getItem(LAST_PROJECT_KEY);
    } catch {
      return null;
    }
  },
  set(id: string): void {
    try {
      localStorage.setItem(LAST_PROJECT_KEY, id);
    } catch {
      // storage can be blocked (private mode); the project link still works
    }
  },
};
