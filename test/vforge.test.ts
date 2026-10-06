import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { toSlug, uniqueSlug } from "../src/lib/slug";
import { renderProjectMd } from "../src/lib/project-md";
import { seedProject } from "../src/commands/create-next";

describe("slug", () => {
  test("normalizes accents and punctuation", () => {
    expect(toSlug("Landing Page: Analítica SaaS!")).toBe("landing-page-analitica-saas");
  });
  test("truncates to 40 chars", () => {
    expect(toSlug("a".repeat(100)).length).toBe(40);
  });
  test("uniqueSlug appends counter", () => {
    const taken = new Set(["app", "app-1"]);
    expect(uniqueSlug("app", (s) => taken.has(s))).toBe("app-2");
  });
});

describe("project-md", () => {
  test("renders prompt and status", () => {
    const md = renderProjectMd({
      slug: "x", prompt: "my prompt", spec: "s", visualDirection: "v",
      outputPath: "/tmp/x", buildPassed: false, repairAttempts: 0,
    });
    expect(md).toContain("my prompt");
    expect(md).toContain("Passed: no");
  });
});

describe("seedProject", () => {
  test("creates scaffold from built templates", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "vforge-seed-"));
    const out = path.join(dir, "app");
    await seedProject(out, "app", "hello", dir);
    expect(existsSync(path.join(out, "PROJECT.md"))).toBe(true);
    expect(existsSync(path.join(out, "opencode.json"))).toBe(true);
    expect(existsSync(path.join(out, "agents", "vforge-builder.md"))).toBe(true);
    expect(existsSync(path.join(dir, ".vforge-lock.json"))).toBe(true);
    const pkg = JSON.parse(await readFile(path.join(out, "package.json"), "utf-8"));
    expect(pkg.name).toBe("app");
    expect(pkg.devDependencies.vforge).toMatch(/^\^\d+\.\d+\.\d+/);
  });
});

describe("cli", () => {
  const home = () => mkdtemp(path.join(os.tmpdir(), "vforge-home-"));
  const run = (h: string, cmd: string) =>
    spawnSync("node", [path.resolve("bin/vforge.js"), cmd], {
      env: { ...process.env, HOME: h, APPDATA: "" }, encoding: "utf-8",
    });

  test("install is idempotent and uninstall reverts", async () => {
    const h = await home();
    const cfg = path.join(h, ".config", "opencode", "opencode.json");
    expect(run(h, "install").status).toBe(0);
    expect(run(h, "install").stdout).toContain("already registered");
    expect(JSON.parse(await readFile(cfg, "utf-8")).plugin).toEqual(["vforge"]);
    expect((await readdir(path.join(h, ".config", "opencode", "skills"))).length).toBe(4);
    expect(run(h, "uninstall").status).toBe(0);
    expect(JSON.parse(await readFile(cfg, "utf-8")).plugin).toEqual([]);
  });

  test("unknown subcommand exits 1", async () => {
    expect(run(await home(), "nope").status).toBe(1);
  });
});
