import { readFile, writeFile, copyFile, mkdir, readdir, rmdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const CONFIG_PATH = path.join(os.homedir(), ".config", "opencode", "opencode.json");
const SKILLS_DIR = path.join(os.homedir(), ".config", "opencode", "skills");
const PLUGIN_NAME = "vforge";

// Resolve package root from dist/cli.js -> package root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "..");
const BUNDLED_SKILLS_DIR = path.join(PACKAGE_ROOT, "dist", "skills");

interface OpencodeConfig {
  $schema?: string;
  plugin?: (string | [string, Record<string, unknown>])[];
  [key: string]: unknown;
}

async function readConfig(): Promise<{ config: OpencodeConfig; raw: string }> {
  let raw = "{}";
  let config: OpencodeConfig = {};
  if (existsSync(CONFIG_PATH)) {
    raw = await readFile(CONFIG_PATH, "utf-8");
    try {
      config = JSON.parse(raw);
    } catch {
      throw new Error(`Invalid JSON at ${CONFIG_PATH}`);
    }
  }
  return { config, raw };
}

function hasPlugin(config: OpencodeConfig): boolean {
  if (!Array.isArray(config.plugin)) return false;
  return config.plugin.some((entry) => {
    if (typeof entry === "string") return entry === PLUGIN_NAME;
    return Array.isArray(entry) && entry[0] === PLUGIN_NAME;
  });
}

function addPlugin(config: OpencodeConfig): OpencodeConfig {
  const next = { ...config };
  next.plugin = Array.isArray(next.plugin) ? [...next.plugin] : [];
  if (!hasPlugin(next)) {
    next.plugin.push(PLUGIN_NAME);
  }
  return next;
}

function removePlugin(config: OpencodeConfig): OpencodeConfig {
  const next = { ...config };
  if (!Array.isArray(next.plugin)) return next;
  next.plugin = next.plugin.filter((entry) => {
    if (typeof entry === "string") return entry !== PLUGIN_NAME;
    return !(Array.isArray(entry) && entry[0] === PLUGIN_NAME);
  });
  return next;
}

async function backupConfig(raw: string): Promise<void> {
  const backupPath = `${CONFIG_PATH}.vforge-bak-${Date.now()}`;
  await writeFile(backupPath, raw, "utf-8");
  console.log(`Backup saved to ${backupPath}`);
}

async function copyDir(src: string, dest: string): Promise<void> {
  if (!existsSync(src)) return;
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await mkdir(path.dirname(destPath), { recursive: true });
      await copyFile(srcPath, destPath);
    }
  }
}

async function removeDir(dir: string): Promise<void> {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeDir(entryPath);
      await rmdir(entryPath);
    } else {
      await unlink(entryPath);
    }
  }
}

async function installSkills(): Promise<void> {
  if (!existsSync(BUNDLED_SKILLS_DIR)) {
    console.log(`No bundled skills found at ${BUNDLED_SKILLS_DIR}`);
    return;
  }
  await copyDir(BUNDLED_SKILLS_DIR, SKILLS_DIR);
  console.log(`Skills installed to ${SKILLS_DIR}`);
}

async function uninstallSkills(): Promise<void> {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(SKILLS_DIR, entry.name, "SKILL.md");
    if (!existsSync(skillPath)) continue;
    const content = await readFile(skillPath, "utf-8").catch(() => "");
    if (content.includes("name: vforge-")) {
      await removeDir(path.join(SKILLS_DIR, entry.name));
      await rmdir(path.join(SKILLS_DIR, entry.name)).catch(() => {});
    }
  }
  console.log("vforge skills removed");
}

async function install(): Promise<void> {
  const { config, raw } = await readConfig();
  if (hasPlugin(config)) {
    console.log(`vforge is already registered in ${CONFIG_PATH}`);
  } else {
    await backupConfig(raw);
    const next = addPlugin(config);
    next.$schema = next.$schema || "https://opencode.ai/config.json";
    await mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    await writeFile(CONFIG_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");
    console.log(`vforge registered in ${CONFIG_PATH}`);
  }
  await installSkills();
  console.log("Restart opencode for changes to take effect.");
}

async function uninstall(): Promise<void> {
  const { config, raw } = await readConfig();
  if (!hasPlugin(config)) {
    console.log(`vforge is not registered in ${CONFIG_PATH}`);
  } else {
    await backupConfig(raw);
    const next = removePlugin(config);
    await writeFile(CONFIG_PATH, JSON.stringify(next, null, 2) + "\n", "utf-8");
    console.log(`vforge removed from ${CONFIG_PATH}`);
  }
  await uninstallSkills();
  console.log("Restart opencode for changes to take effect.");
}

async function doctor(): Promise<void> {
  const { config } = await readConfig();
  const pluginRegistered = hasPlugin(config);
  const checks = [
    `Config file: ${existsSync(CONFIG_PATH) ? "found" : "missing"}`,
    `Plugin registered: ${pluginRegistered ? "yes" : "no"}`,
    `Skills installed: ${existsSync(SKILLS_DIR) ? "yes" : "no"}`,
    `Bun available: ${commandExists("bun") ? "yes" : "no"}`,
    `Podman available: ${commandExists("podman") ? "yes" : "no"}`,
    `Node available: ${commandExists("node") ? "yes" : "no"}`,
  ];
  console.log(checks.join("\n"));
  if (!pluginRegistered) {
    console.log("\nRun: vforge install");
  }
}

function commandExists(cmd: string): boolean {
  // Simple PATH check; production code may use `which`.
  try {
    execSync(`${cmd} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const subcommand = process.argv[2];
  switch (subcommand) {
    case "install":
      await install();
      break;
    case "uninstall":
      await uninstall();
      break;
    case "doctor":
      await doctor();
      break;
    default:
      console.log("Usage: vforge <install|uninstall|doctor>");
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
