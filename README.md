# vforge

`vforge` is an [OpenCode](https://opencode.ai) plugin that generates local, deployable **React** apps (Next.js, Vite, React Router v7, TanStack Start) from a single prompt, using your own configured AI model providers.

Every generated project keeps a living workspace inside it, so you can keep iterating with opencode commands like `/iterate`, `/page`, and `/component`.

---

## Features

- **Prompt-to-app**: `/vforge vite "landing page premium para analytics SaaS"`
- **Multiple React frameworks**: Next.js, Vite + React, React Router v7, TanStack Start.
- **Your own AI providers**: uses OpenCode's configured models via dedicated agents.
- **Bun + Next.js + Tailwind + shadcn**: fast, modern stack.
- **Living workspace**: each generated project includes `vforge` as a devDependency and an `opencode.json` workspace.
- **Build + repair loop**: builds are validated and repaired automatically.
- **Multi-template ready**: each framework is a descriptor plus a template; Vue, Svelte and others can follow.

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
/vforge <framework> <app description>
/vforge next landing page premium para analytics SaaS
/vforge vite dashboard de finanzas personales
/vforge react-router blog con posts mockeados
/vforge tanstack tablero kanban
```

| Framework | Id (aliases) | Rendering | Build check |
|---|---|---|---|
| Next.js (App Router) | `next` | SSR/SSG | `bun run build` |
| Vite + React | `vite` | SPA | `tsc` + `vite build` |
| React Router v7 (framework mode) | `react-router` (`rr`) | SSR | `typegen` + `tsc` + `react-router build` |
| TanStack Start | `tanstack` (`tanstack-start`) | SSR | `vite build` + `tsc` |

If you omit the framework, `next` is used (backward compatible with 0.1.x).

The plugin scaffolds the project deterministically, then runs four skills in order:

1. `vforge-planner` — converts your prompt into a concise implementation spec.
2. `vforge-designer` — creates a visual direction.
3. `vforge-builder` — builds the app inside the scaffold and runs `bun install && bun run build`.
4. `vforge-reviewer-fixer` — validates the build and fixes issues.

Each framework ships its own rules (routing, folders, import alias) that the skills read from `.vforge-lock.json`, so the planner, builder and reviewer never mix conventions.

The generated project is placed in `./<slug>/` (relative to the directory where you run OpenCode).

---

## Generated project structure

```text
my-app/
├── app/ or src/            # Routes and source (depends on the framework)
├── components.json         # shadcn config
├── package.json            # Includes vforge as devDependency
├── PROJECT.md              # Prompt, spec, visual direction, status
├── opencode.json           # Local workspace config
├── .opencode/commands/     # /iterate, /page, /component (framework-aware)
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
| `/vforge <framework> <prompt>` | Generate another project. |

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
│   │   └── create-project.ts  # scaffolds a project for a given framework
│   ├── agents/             # Subagent prompt files
│   ├── skills/             # vforge-* skills installed by the CLI
│   ├── templates/          # One template per framework
│   ├── lib/frameworks.ts   # Framework registry (ids, rules, templates)
│   ├── lib/                # Helpers (slug, PROJECT.md)
│   └── generated-config/   # Files copied into each generated project
└── dist/                   # Compiled output
```

### Plugin lifecycle

1. OpenCode loads `vforge` from the global `plugin` array.
2. `src/plugin.ts` registers the `/vforge` command and the `vforge_create` tool (`vforge_next` kept as alias).
3. On `/vforge <framework> <prompt>`, the `command.execute.before` hook calls `seedProject` (`create-next.ts`) to copy the template, local config and `PROJECT.md`.
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
bun test                    # unit tests
VFORGE_E2E=1 bun test       # also installs and builds every template (slow, needs network)
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
- [x] Vite, React Router v7 and TanStack Start templates
- [ ] Vue template (`/vforge vue`)
- [ ] Svelte template (`/vforge svelte`)
- [ ] Configurable output directory

---

## License

MIT
