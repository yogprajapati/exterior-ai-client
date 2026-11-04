import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const serverDir = new URL("../../server/", import.meta.url).pathname;
const spec = join(mkdtempSync(join(tmpdir(), "openapi-")), "openapi.json");

execFileSync(join(serverDir, ".venv/bin/python"), ["scripts/export_openapi.py", spec], { cwd: serverDir, stdio: "inherit" });
execFileSync("npx", ["openapi-typescript", spec, "-o", "src/api/schema.d.ts"], { stdio: "inherit" });
