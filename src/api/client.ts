import type { QualityIssue } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const apiUrl = (path: string): string => `${BASE_URL}${path}`;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly issues: QualityIssue[] = [],
  ) {
    super(message);
  }
}

interface ErrorDetail {
  message: string;
  issues: QualityIssue[];
}

function parseDetail(detail: unknown): ErrorDetail {
  if (typeof detail === "string") return { message: detail, issues: [] };
  if (Array.isArray(detail)) {
    // FastAPI validation errors: a list of { msg }
    const message = detail.map((d) => String(d.msg ?? d).replace(/^Value error, /, "")).join(" ");
    return { message, issues: [] };
  }
  if (detail && typeof detail === "object" && "issues" in detail) {
    const issues = (detail as { issues: QualityIssue[] }).issues;
    return { message: issues.map((i) => i.message).join(" "), issues };
  }
  return { message: "Something went wrong. Please try again.", issues: [] };
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), init);
  } catch {
    throw new ApiError(0, "We can't reach the server right now. Check your internet connection and try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const { message, issues } = parseDetail(body?.detail);
    throw new ApiError(response.status, message, issues);
  }
  return response;
}

export const http = {
  json: async <T>(path: string, init?: RequestInit): Promise<T> => (await request(path, init)).json(),
  blob: async (path: string): Promise<Blob> => (await request(path)).blob(),
  sendJson: <T>(method: string, path: string, body: unknown): Promise<T> =>
    http.json<T>(path, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
};

export const errorMessage = (error: unknown): string => (error instanceof Error ? error.message : "Something went wrong. Please try again.");
