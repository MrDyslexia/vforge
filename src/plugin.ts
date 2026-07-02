import { tool } from "@opencode-ai/plugin";
import type { Plugin, PluginInput, Config } from "@opencode-ai/plugin";
import { seedProject } from "./commands/create-next.js";
import { toSlug, uniqueSlug } from "./lib/slug.js";
import { existsSync } from "node:fs";
import path from "node:path";

console.error("[vforge] plugin module loaded");

const COMMAND_ID = "vforge";

const vforgePlugin: Plugin = async ({ client, directory }: PluginInput) => {
  console.error("[vforge] plugin init, directory:", directory);

  return {
    config: async (cfg: Config) => {
      cfg.command ??= {};
      cfg.command[COMMAND_ID] = {
        template: "/vforge next",
        description:
          "Generate a local Bun/Next.js app from a prompt. Usage: /vforge next <your app description>",
      };
    },

    // This hook fires deterministically when the user runs /vforge next.
    // It seeds the project directory before the LLM sees the message.
    "command.execute.before": async (input) => {
      if (input.command !== COMMAND_ID) return;
      const args = ((input as Record<string, unknown>).arguments as string | undefined || "").trim();
      const prompt = args.replace(/^next\s+/i, "").trim();
      const sessionID = ((input as Record<string, unknown>).sessionID as string | undefined) || "";

      console.error("[vforge] command.execute.before fired, prompt:", prompt);

      if (!prompt) {
        await client.session.prompt({
          path: { id: sessionID },
          body: {
            parts: [{ type: "text", text: "Provide a prompt: /vforge next <description>" }],
          },
        });
        return;
      }

      const baseSlug = toSlug(prompt) || "vforge-app";
      const slug = uniqueSlug(baseSlug, (s) => existsSync(path.resolve(directory, s)));
      const outputPath = path.resolve(directory, slug);

      console.error("[vforge] seeding project at:", outputPath);
      await seedProject(outputPath, slug, prompt, directory);
      console.error("[vforge] seeding done");

      await client.session.prompt({
        path: { id: sessionID },
        body: {
          parts: [
            {
              type: "text",
              text: [
                `**vforge scaffold ready** at \`${outputPath}\``,
                "",
                "Contents already seeded (do not recreate or overwrite these):",
                `- \`${outputPath}/\` — Next.js template (App Router, TypeScript, Tailwind, shadcn-style)`,
                `- \`${outputPath}/opencode.json\` — local commands: /iterate, /page, /component`,
                `- \`${outputPath}/PROJECT.md\` — fill with spec and visual direction`,
                `- \`${outputPath}/agents/vforge-builder.md\``,
                `- \`${outputPath}/package.json\` — includes \`vforge\` in devDependencies`,
                `- \`.vforge-lock.json\` in project root — canonical slug and outputPath`,
                "",
                "Build workflow (execute in order, no skipping):",
                `1. /vforge-planner: produce spec for prompt "${prompt}". Append to \`${outputPath}/PROJECT.md\` under ## Implementation Spec.`,
                `2. /vforge-designer: produce visual direction from spec. Append to \`${outputPath}/PROJECT.md\` under ## Visual Direction.`,
                `3. /vforge-builder: build the app inside \`${outputPath}\` (scaffold already exists). Run \`bun install && bun run build\` from \`${outputPath}\`. After bun install, verify \`vforge\` is still in devDependencies — if missing, re-add it.`,
                `4. /vforge-reviewer-fixer: fix any issues in \`${outputPath}\`.`,
                "",
                "After build passes: summarize app, output path, and /iterate /page /component commands.",
              ].join("\n"),
            },
          ],
        },
      });
    },

    // Also expose vforge_next as a tool so the LLM can call it explicitly.
    tool: {
      vforge_next: tool({
        description:
          "Scaffold a Bun/Next.js app and start the vforge build workflow. " +
          "Use when the user asks to generate an app with vforge.",
        args: {
          prompt: tool.schema.string().describe("App description from the user."),
        },
        async execute({ prompt }, { directory: cwd }) {
          console.error("[vforge] vforge_next tool called, prompt:", prompt);
          const baseSlug = toSlug(prompt) || "vforge-app";
          const slug = uniqueSlug(baseSlug, (s) => existsSync(path.resolve(cwd, s)));
          const outputPath = path.resolve(cwd, slug);
          await seedProject(outputPath, slug, prompt, cwd);
          return [
            `Scaffold ready at \`${outputPath}\`. Now execute the build workflow:`,
            `1. /vforge-planner → spec → append to \`${outputPath}/PROJECT.md\``,
            `2. /vforge-designer → visual direction → append to \`${outputPath}/PROJECT.md\``,
            `3. /vforge-builder → build inside \`${outputPath}\` → bun install && bun run build`,
            `4. /vforge-reviewer-fixer → fix issues in \`${outputPath}\``,
          ].join("\n");
        },
      }),
    },
  };
};

export default {
  id: "vforge",
  server: vforgePlugin,
};
