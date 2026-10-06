import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderProjectMd } from "../lib/project-md.js";
import { DEFAULT_FRAMEWORK, getFramework, type FrameworkDef } from "../lib/frameworks.js";

function pluginRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

async function pluginVersion(root: string): Promise<string> {
  const pkg = JSON.parse(await readFile(path.join(root, "..", "package.json"), "utf-8"));
  return pkg.version as string;
}

export interface VforgeLock {
  slug: string;
  outputPath: string;
  prompt: string;
  createdAt: string;
  framework: string;
  frameworkLabel: string;
  /** Framework-specific rules every vforge skill must follow. */
  frameworkRules: string[];
  buildCmd: string;
}

const GITIGNORE = ["node_modules/", ".next/", ".react-router/", "build/", "dist/", ".output/", ".vinxi/", ".DS_Store", ".env", ".env.local", ""].join("\n");

function renderCommand(template: string, fw: FrameworkDef): string {
  return template
    .replaceAll("{{FRAMEWORK_LABEL}}", fw.label)
    .replaceAll("{{PAGE_RULE}}", fw.pageRule)
    .replaceAll("{{COMPONENTS_DIR}}", fw.componentsDir)
    .replaceAll("{{BUILD_CMD}}", fw.buildCmd);
}

export async function seedProject(
  outputPath: string,
  slug: string,
  prompt: string,
  cwd: string,
  frameworkId: string = DEFAULT_FRAMEWORK,
): Promise<void> {
  const fw = getFramework(frameworkId);
  if (!fw) throw new Error(`Unknown framework "${frameworkId}"`);

  const root = pluginRoot();
  const templatePath = path.join(root, "templates", fw.template);
  const generatedConfigPath = path.join(root, "generated-config");

  // 1. Write lock file in cwd so all skills read the canonical path and framework rules.
  const lock: VforgeLock = {
    slug,
    outputPath,
    prompt,
    createdAt: new Date().toISOString(),
    framework: fw.id,
    frameworkLabel: fw.label,
    frameworkRules: fw.rules,
    buildCmd: fw.buildCmd,
  };
  await writeFile(path.join(cwd, ".vforge-lock.json"), JSON.stringify(lock, null, 2) + "\n", "utf-8");

  // 2. Copy template into output directory
  await cp(templatePath, outputPath, { recursive: true, force: true });
  await writeFile(path.join(outputPath, ".gitignore"), GITIGNORE, "utf-8");

  // 3. Add vforge devDependency
  const packageJsonPath = path.join(outputPath, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
  packageJson.name = slug;
  packageJson.devDependencies ??= {};
  packageJson.devDependencies.vforge = `^${await pluginVersion(root)}`;
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");

  // 4. Copy local opencode config
  await cp(path.join(generatedConfigPath, "opencode.json"), path.join(outputPath, "opencode.json"));

  // 5. Render local iteration commands for this framework
  const commandsSrc = path.join(generatedConfigPath, "commands");
  const commandsDest = path.join(outputPath, ".opencode", "commands");
  await mkdir(commandsDest, { recursive: true });
  for (const file of await readdir(commandsSrc)) {
    const content = await readFile(path.join(commandsSrc, file), "utf-8");
    await writeFile(path.join(commandsDest, file), renderCommand(content, fw), "utf-8");
  }

  // 6. Copy builder agent prompt so local opencode.json can resolve it
  const agentsDir = path.join(outputPath, "agents");
  await mkdir(agentsDir, { recursive: true });
  await cp(path.join(root, "agents", "vforge-builder.md"), path.join(agentsDir, "vforge-builder.md"));

  // 7. Seed PROJECT.md
  const projectMd = renderProjectMd({
    slug,
    prompt,
    spec: "(to be filled by vforge-planner)",
    visualDirection: "(to be filled by vforge-designer)",
    outputPath,
    buildPassed: false,
    repairAttempts: 0,
    framework: fw.id,
    stack: fw.stack,
  });
  await writeFile(path.join(outputPath, "PROJECT.md"), projectMd, "utf-8");
}
