import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { toSlug, uniqueSlug } from "../src/lib/slug";
import { renderProjectMd } from "../src/lib/project-md";
import { FRAMEWORKS, getFramework, parseArgs } from "../src/lib/frameworks";
import { findRecentScaffold, seedProject } from "../src/commands/create-project";

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

describe("frameworks", () => {
  test("parseArgs picks framework and prompt", () => {
    expect(parseArgs("vite landing page").framework.id).toBe("vite");
    expect(parseArgs("vite landing page").prompt).toBe("landing page");
    expect(parseArgs("rr dashboard").framework.id).toBe("react-router");
    expect(parseArgs("tanstack-start blog").framework.id).toBe("tanstack");
  });
  test("parseArgs falls back to next for backward compatibility", () => {
    const r = parseArgs("landing page premium");
    expect(r.framework.id).toBe("next");
    expect(r.prompt).toBe("landing page premium");
    expect(r.usedDefault).toBe(true);
    expect(parseArgs("next landing").prompt).toBe("landing");
  });
  test("parseArgs tolerates wrapping quotes", () => {
    const r = parseArgs('"tanstack tablero kanban"');
    expect(r.framework.id).toBe("tanstack");
    expect(r.prompt).toBe("tablero kanban");
    expect(parseArgs("'vite hola'").framework.id).toBe("vite");
    expect(parseArgs("vite \"con comillas\" dentro").prompt).toBe('"con comillas" dentro');
  });
  test("parseArgs with no prompt", () => {
    expect(parseArgs("vite").prompt).toBe("");
    expect(parseArgs("").prompt).toBe("");
  });
  test("every framework has an existing template with package.json", () => {
    for (const fw of FRAMEWORKS) {
      expect(existsSync(path.resolve("src/templates", fw.template, "package.json"))).toBe(true);
      expect(fw.rules.length).toBeGreaterThan(0);
    }
  });
  test("unknown framework id", () => {
    expect(getFramework("svelte")).toBeUndefined();
  });
});

describe.each(FRAMEWORKS.map((f) => f.id))("seedProject (%s)", (id) => {
  test("creates scaffold, lock, commands and gitignore", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "vforge-seed-"));
    const out = path.join(dir, "app");
    await seedProject(out, "app", "hello", dir, id);
    for (const f of ["PROJECT.md", "opencode.json", "agents/vforge-builder.md", ".gitignore", ".vforge-lock.json", ".opencode/commands/page.md"]) {
      expect(existsSync(path.join(out, f))).toBe(true);
    }
    const lock = JSON.parse(await readFile(path.join(dir, ".vforge-lock.json"), "utf-8"));
    expect(lock.framework).toBe(id);
    expect(lock.frameworkRules.length).toBeGreaterThan(0);
    const pkg = JSON.parse(await readFile(path.join(out, "package.json"), "utf-8"));
    expect(pkg.name).toBe("app");
    expect(pkg.devDependencies.vforge).toMatch(/^\^\d+\.\d+\.\d+/);
    const page = await readFile(path.join(out, ".opencode/commands/page.md"), "utf-8");
    expect(page).not.toContain("{{");
    expect(page).toContain(getFramework(id)!.label);
    expect(await readFile(path.join(out, "PROJECT.md"), "utf-8")).toContain(`**Framework:** ${id}`);
  });
});

describe("findRecentScaffold", () => {
  test("detects a duplicate request and ignores others", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "vforge-dup-"));
    expect(await findRecentScaffold(dir, "p")).toBeUndefined();
    await seedProject(path.join(dir, "a"), "a", "p", dir, "vite");
    expect((await findRecentScaffold(dir, "p"))?.framework).toBe("vite");
    expect(await findRecentScaffold(dir, "other prompt")).toBeUndefined();
    expect(await findRecentScaffold(dir, "p", -1)).toBeUndefined();
  });
});

describe("seedProject defaults", () => {
  test("defaults to next and rejects unknown frameworks", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "vforge-seed-"));
    await seedProject(path.join(dir, "a"), "a", "p", dir);
    expect(JSON.parse(await readFile(path.join(dir, ".vforge-lock.json"), "utf-8")).framework).toBe("next");
    await expect(seedProject(path.join(dir, "b"), "b", "p", dir, "svelte")).rejects.toThrow("Unknown framework");
  });
});

// Slow: installs deps and builds each template. Run with `VFORGE_E2E=1 bun test`.
describe.skipIf(!process.env.VFORGE_E2E)("template builds (e2e)", () => {
  for (const fw of FRAMEWORKS) {
    test(`${fw.id} builds`, async () => {
      const dir = await mkdtemp(path.join(os.tmpdir(), "vforge-e2e-"));
      const out = path.join(dir, "app");
      await seedProject(out, "app", "e2e", dir, fw.id);
      // vforge devDependency is only resolvable once published; drop it for the build check.
      const pkgPath = path.join(out, "package.json");
      const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
      delete pkg.devDependencies.vforge;
      await Bun.write(pkgPath, JSON.stringify(pkg, null, 2));
      const install = spawnSync("bun", ["install"], { cwd: out, encoding: "utf-8" });
      expect(install.status).toBe(0);
      const build = spawnSync("bun", ["run", "build"], { cwd: out, encoding: "utf-8" });
      expect(build.status).toBe(0);
    }, 240_000);
  }
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
