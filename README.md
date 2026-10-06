# vforge

`vforge` is an [OpenCode](https://opencode.ai) plugin that generates local, deployable **Next.js** apps from a single prompt, using your own configured AI model providers.

Every generated project keeps a living workspace inside it, so you can keep iterating with opencode commands like `/iterate`, `/page`, and `/component`.

---

## Features

- **Prompt-to-app**: `/vforge next "landing page premium para analytics SaaS"`
- **Your own AI providers**: uses OpenCode's configured models via dedicated agents.
- **Bun + Next.js + Tailwind + shadcn**: fast, modern stack.
- **Living workspace**: each generated project includes `vforge` as a devDependency and an `opencode.json` workspace.
- **Build + repair loop**: builds are validated and repaired automatically.
- **Multi-template ready**: currently Next.js; Vue, Svelte and others are planned.

---

## Installation

Requirements: [OpenCode](https://opencode.ai) and [Bun](https://bun.sh) (generated apps are built with Bun). Podman is optional.

```bash
bunx vforge install
```

(`npx vforge install` also works.) This registers the plugin in your global OpenCode config and installs the four vforge skills:

- Linux/macOS: `~/.config/opencode/opencode.json`
- Windows: `%APPDATA%\opencode\opencode.json`

A timestamped backup of your config is written before any change. **Restart OpenCode** afterwards.

```bash
bunx vforge doctor      # check config, skills, bun/podman/node
bunx vforge uninstall   # remove plugin entry and skills
```

### From source

```bash
git clone https://github.com/MrDyslexia/vforge.git
cd vforge
bun install && bun run build
node bin/vforge.js install
```

### Debugging

Set `VFORGE_DEBUG=1` before starting OpenCode to print plugin logs to stderr.

---

## Usage

### Inside OpenCode

```text
/vforge next landing page premium para analytics SaaS
```

The plugin scaffolds the project deterministically, then runs four skills in order:

1. `vforge-planner` — converts your prompt into a concise implementation spec.
2. `vforge-designer` — creates a visual direction.
3. `vforge-builder` — builds the app inside the scaffold and runs `bun install && bun run build`.
4. `vforge-reviewer-fixer` — validates the build and fixes issues.

The generated project is placed in `./<slug>/` (relative to the directory where you run OpenCode).

---

## Generated project structure

```text
my-app/
├── app/                    # Next.js App Router
├── components/             # Components
├── lib/                    # Utilities
├── package.json            # Includes vforge as devDependency
├── PROJECT.md              # Prompt, spec, visual direction, status
├── opencode.json           # Local workspace config
└── agents/
    └── vforge-builder.md   # Local builder agent prompt
```

---

## Commands available inside a generated project

Open the generated project with OpenCode. These commands are available:

| Command | Purpose |
|---|---|
| `/iterate <prompt>` | Evolve or refactor the app. |
| `/page <name>` | Add a new page. |
| `/component <name>` | Add a new component. |
| `/vforge next` | Generate another project. |

---

## Architecture

```text
vforge/
├── bin/vforge.js           # CLI entry point
├── test/                   # bun test suite
├── src/
│   ├── plugin.ts           # OpenCode plugin entry point
│   ├── cli.ts              # CLI install/uninstall/doctor
│   ├── commands/
│   │   └── create-next.ts  # /vforge next handler
│   ├── agents/             # Subagent prompt files
│   ├── skills/             # vforge-* skills installed by the CLI
│   ├── templates/          # Next.js template
│   ├── lib/                # Helpers (slug, PROJECT.md)
│   └── generated-config/   # Files copied into each generated project
└── dist/                   # Compiled output
```

### Plugin lifecycle

1. OpenCode loads `vforge` from the global `plugin` array.
2. `src/plugin.ts` registers the `/vforge` command and the `vforge_next` tool.
3. On `/vforge next`, the `command.execute.before` hook calls `seedProject` (`create-next.ts`) to copy the template, local config and `PROJECT.md`.
4. The LLM then runs the four skills; the builder installs dependencies and runs the build.
5. The reviewer fixes any build issues.
6. The project is finalized with `PROJECT.md`, local `opencode.json`, and iteration commands.

---

## Development

```bash
git clone https://github.com/MrDyslexia/vforge.git
cd vforge
bun install
bun run build
bun test
```

Run tests, then the install test in a clean Linux container (requires Podman):

```bash
bash sandbox/test-bun-install.sh
```

---

## Troubleshooting

### `Cannot find module '../dist/cli.js'`

You are running from a source checkout without building. Run `bun run build`.

### `/vforge next` does not appear in OpenCode

Run `bunx vforge doctor`, confirm "Plugin registered: yes", and restart OpenCode. Set `VFORGE_DEBUG=1` to see plugin logs.

### `bun install` fails in a generated project

Generated projects list `vforge` as a devDependency. Make sure you have network access to the npm registry.

---

## Roadmap

- [x] Next.js template
- [x] Living workspace in generated projects
- [x] Windows compatibility
- [x] Publish to npm
- [ ] CLI `vforge next` without OpenCode running
- [ ] Vue template (`/vforge vue`)
- [ ] Svelte template (`/vforge svelte`)
- [ ] Configurable output directory

---

## License

MIT
