import { spawn } from "node:child_process";
import path from "node:path";

export interface BuildResult {
  success: boolean;
  attempts: number;
  output: string;
}

function runCommand(cmd: string, args: string[], cwd: string): Promise<{ code: number | null; output: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout?.on("data", (data) => {
      output += data.toString();
    });
    child.stderr?.on("data", (data) => {
      output += data.toString();
    });
    child.on("close", (code) => {
      resolve({ code, output });
    });
  });
}

export async function installDependencies(projectPath: string): Promise<{ success: boolean; output: string }> {
  const result = await runCommand("bun", ["install"], projectPath);
  return { success: result.code === 0, output: result.output };
}

export async function buildProject(projectPath: string): Promise<{ success: boolean; output: string }> {
  const result = await runCommand("bun", ["run", "build"], projectPath);
  return { success: result.code === 0, output: result.output };
}

export async function buildWithRepair(
  projectPath: string,
  maxAttempts = 3,
): Promise<BuildResult> {
  let attempts = 0;
  let output = "";

  while (attempts < maxAttempts) {
    attempts += 1;
    const result = await buildProject(projectPath);
    output += `\n--- Attempt ${attempts} ---\n${result.output}`;
    if (result.success) {
      return { success: true, attempts, output };
    }
    // The repair logic is intentionally delegated to vforge-reviewer-fixer.
    // This loop exists so the orchestrator knows when to stop trying.
  }

  return { success: false, attempts, output };
}

export function detectPackageManager(projectPath: string): "bun" | "npm" {
  // Prefer bun lockfile; default to bun because the template uses it.
  return "bun";
}

export function addDevDependency(projectPath: string, name: string, version = "^0.1.0"): void {
  const pkgPath = path.join(projectPath, "package.json");
  const pkg = require(pkgPath);
  pkg.devDependencies = pkg.devDependencies || {};
  pkg.devDependencies[name] = version;
  require("node:fs").writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}
