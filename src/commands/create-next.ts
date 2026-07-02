import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderProjectMd } from "../lib/project-md.js";

function pluginRoot(): string {
  return path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
}

export interface VforgeLock {
  slug: string;
  outputPath: string;
  prompt: string;
  createdAt: string;
}

export async function seedProject(outputPath: string, slug: string, prompt: string, cwd: string): Promise<void> {
  const root = pluginRoot();
  const templatePath = path.join(root, "templates", "next-shadcn-base");
  const generatedConfigPath = path.join(root, "generated-config");

  // 1. Write lock file in cwd so all skills read the canonical path.
  const lock: VforgeLock = { slug, outputPath, prompt, createdAt: new Date().toISOString() };
  await writeFile(path.join(cwd, ".vforge-lock.json"), JSON.stringify(lock, null, 2) + "\n", "utf-8");

  // 2. Copy template into output directory
  await cp(templatePath, outputPath, { recursive: true, force: true });

  // 3. Add vforge devDependency
  const packageJsonPath = path.join(outputPath, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
  packageJson.name = slug;
  packageJson.devDependencies ??= {};
  packageJson.devDependencies.vforge = "latest";
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");

  // 4. Copy local opencode config
  await cp(
    path.join(generatedConfigPath, "opencode.json"),
    path.join(outputPath, "opencode.json"),
  );

  // 5. Copy builder agent prompt so local opencode.json can resolve it
  const agentsDir = path.join(outputPath, "agents");
  await mkdir(agentsDir, { recursive: true });
  await cp(
    path.join(root, "agents", "vforge-builder.md"),
    path.join(agentsDir, "vforge-builder.md"),
  );

  // 6. Seed PROJECT.md
  const projectMd = renderProjectMd({
    slug,
    prompt,
    spec: "(to be filled by vforge-planner)",
    visualDirection: "(to be filled by vforge-designer)",
    outputPath,
    buildPassed: false,
    repairAttempts: 0,
  });
  await writeFile(path.join(outputPath, "PROJECT.md"), projectMd, "utf-8");
}


