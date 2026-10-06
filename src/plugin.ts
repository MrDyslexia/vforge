import { tool } from "@opencode-ai/plugin";
import type { Plugin, PluginInput, Config } from "@opencode-ai/plugin";
import { seedProject } from "./commands/create-project.js";
import { FRAMEWORKS, getFramework, parseArgs, usageText, type FrameworkDef } from "./lib/frameworks.js";
import { toSlug, uniqueSlug } from "./lib/slug.js";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const DEBUG = Boolean(process.env.VFORGE_DEBUG);
const log = (...args: unknown[]) => {
  if (DEBUG) console.error("[vforge]", ...args);
};

const COMMAND_ID = "vforge";

async function scaffold(
  fw: FrameworkDef,
  prompt: string,
  cwd: string,
): Promise<{ outputPath: string; message: string }> {
  const baseSlug = toSlug(prompt) || "vforge-app";
  const slug = uniqueSlug(baseSlug, (s) => existsSync(path.resolve(cwd, s)));
  const outputPath = path.resolve(cwd, slug);

  log("seeding", fw.id, "project at:", outputPath);
  await seedProject(outputPath, slug, prompt, cwd, fw.id);
  log("seeding done");

  const message = [
    `**vforge scaffold ready** at \`${outputPath}\` (${fw.label})`,
    "",
    "Contents already seeded (do not recreate or overwrite these):",
    `- \`${outputPath}/\` — ${fw.label} template (TypeScript, Tailwind, shadcn-style)`,
    `- \`${outputPath}/opencode.json\` and \`.opencode/commands/\` — local commands: /iterate, /page, /component`,
    `- \`${outputPath}/PROJECT.md\` — fill with spec and visual direction`,
    `- \`${outputPath}/agents/vforge-builder.md\``,
    `- \`${outputPath}/package.json\` — includes \`vforge\` in devDependencies`,
    `- \`.vforge-lock.json\` in project root — canonical slug, outputPath, framework and frameworkRules`,
    "",
    `Framework: **${fw.id}**. Every skill must follow \`frameworkRules\` from \`.vforge-lock.json\`. Do not mix in conventions from other frameworks.`,
    "",
    "Build workflow (execute in order, no skipping):",
    `1. /vforge-planner: produce spec for prompt "${prompt}". Append to \`${outputPath}/PROJECT.md\` under ## Implementation Spec.`,
    `2. /vforge-designer: produce visual direction from spec. Append to \`${outputPath}/PROJECT.md\` under ## Visual Direction.`,
    `3. /vforge-builder: build the app inside \`${outputPath}\` (scaffold already exists). Run \`bun install && ${fw.buildCmd}\` from \`${outputPath}\`. After bun install, verify \`vforge\` is still in devDependencies — if missing, re-add it.`,
    `4. /vforge-reviewer-fixer: fix any issues in \`${outputPath}\`.`,
    "",
    "After build passes: summarize app, output path, and /iterate /page /component commands.",
  ].join("\n");

  return { outputPath, message };
}

const vforgePlugin: Plugin = async ({ client, directory }: PluginInput) => {
  log("plugin init, directory:", directory);

  const frameworkIds = FRAMEWORKS.map((f) => f.id) as [string, ...string[]];

  return {
    config: async (cfg: Config) => {
      cfg.command ??= {};
      cfg.command[COMMAND_ID] = {
        template: "/vforge $ARGUMENTS",
        description: `Generate a local Bun/React app from a prompt. Usage: /vforge <${frameworkIds.join("|")}> <your app description>`,
      };
    },

    // This hook fires deterministically when the user runs /vforge <framework> <prompt>.
    // It seeds the project directory before the LLM sees the message.
    "command.execute.before": async (input) => {
      if (input.command !== COMMAND_ID) return;
      const args = (((input as Record<string, unknown>).arguments as string | undefined) || "").trim();
      const sessionID = ((input as Record<string, unknown>).sessionID as string | undefined) || "";
      const { framework, prompt } = parseArgs(args);

      log("command.execute.before fired, framework:", framework.id, "prompt:", prompt);

      if (!prompt) {
        await client.session.prompt({
          path: { id: sessionID },
          body: { parts: [{ type: "text", text: usageText() }] },
        });
        return;
      }

      const { message } = await scaffold(framework, prompt, directory);
      await client.session.prompt({
        path: { id: sessionID },
        body: { parts: [{ type: "text", text: message }] },
      });
    },

    // Also expose the generator as tools so the LLM can call it explicitly.
    tool: {
      vforge_create: tool({
        description:
          "Scaffold a Bun/React app (Next.js, Vite, React Router v7 or TanStack Start) and start the vforge build workflow. " +
          "Use when the user asks to generate an app with vforge.",
        args: {
          framework: tool.schema
            .enum(frameworkIds)
            .describe(`Target framework: ${FRAMEWORKS.map((f) => `${f.id} (${f.label})`).join(", ")}.`),
          prompt: tool.schema.string().describe("App description from the user."),
        },
        async execute({ framework, prompt }, { directory: cwd }) {
          log("vforge_create tool called, framework:", framework, "prompt:", prompt);
          const fw = getFramework(framework);
          if (!fw) return `Unknown framework "${framework}".\n\n${usageText()}`;
          const { message } = await scaffold(fw, prompt, cwd);
          return message;
        },
      }),
      // Kept for backward compatibility with vforge 0.1.x.
      vforge_next: tool({
        description: "Alias of vforge_create with framework=next.",
        args: {
          prompt: tool.schema.string().describe("App description from the user."),
        },
        async execute({ prompt }, { directory: cwd }) {
          log("vforge_next tool called, prompt:", prompt);
          const { message } = await scaffold(getFramework("next")!, prompt, cwd);
          return message;
        },
      }),
    },
  };
};

export default {
  id: "vforge",
  server: vforgePlugin,
};
