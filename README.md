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
- **Optional Podman preview**: run the generated app in a container.
- **Multi-template ready**: currently Next.js; Vue, Svelte and others are planned.

---

## Installation

### With npm

```bash
npm install -g vforge
vforge install
```

### With bun

```bash
bun install -g vforge
vforge install
```

`vforge install` registers the plugin in your OpenCode global config (`~/.config/opencode/opencode.json`). **Restart OpenCode** after installing.

### Verify

```bash
vforge doctor
```

---

## Usage

### Inside OpenCode

```text
/vforge next landing page premium para analytics SaaS
```

The plugin delegates to four agents:

1. `vforge-planner` — converts your prompt into a concise implementation spec.
2. `vforge-designer` — creates a visual direction.
3. `vforge-builder` — copies the Next.js template and generates the app files.
4. `vforge-reviewer-fixer` — validates the build and fixes issues.

The generated project is placed in `~/vforge-apps/<slug>/` by default.

### From the terminal

```bash
vforge next "landing page premium para analytics SaaS"
```

This command is planned for a future release. The primary interface today is the OpenCode slash command.

---

## Generated project structure

```text
~/vforge-apps/my-app/
├── app/                    # Next.js App Router
├── components/             # Components
├── lib/                    # Utilities
├── package.json            # Includes vforge as devDependency
├── Containerfile           # Podman/Docker image
├── PROJECT.md              # Prompt, spec, visual direction, status
├── opencode.json           # Local workspace config
└── .opencode/
    ├── commands/
    │   ├── iterate.md      # /iterate <prompt>
    │   ├── page.md         # /page <name>
    │   └── component.md    # /component <name>
    └── agent/              # Project-local agents
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
├── src/
│   ├── plugin.ts           # OpenCode plugin entry point
│   ├── cli.ts              # CLI install/uninstall/doctor
│   ├── commands/
│   │   └── create-next.ts  # /vforge next handler
│   ├── agents/             # Subagent prompt files
│   ├── templates/          # Next.js template
│   ├── lib/                # Helpers (slug, paths, build, preview, PROJECT.md)
│   └── generated-config/   # Files copied into each generated project
└── dist/                   # Compiled output
```

### Plugin lifecycle

1. OpenCode loads `vforge` from the global `plugin` array.
2. `src/plugin.ts` registers the slash command `/vforge next` and four agents.
3. When the user runs the command, `create-next.ts` orchestrates the workflow.
4. The builder copies the template, edits files, installs dependencies, and runs the build.
5. The reviewer fixes any build issues.
6. The project is finalized with `PROJECT.md`, local `opencode.json`, and iteration commands.

---

## Development

```bash
git clone https://github.com/example/vforge.git
cd vforge
bun install
bun run build
bun link                    # or npm link
vforge install
```

Restart OpenCode after `vforge install`.

---

## Roadmap

- [x] Next.js template
- [x] Living workspace in generated projects
- [ ] CLI `vforge next` without OpenCode running
- [ ] Vue template (`/vforge vue`)
- [ ] Svelte template (`/vforge svelte`)
- [ ] Configurable output directory
- [ ] Automatic Podman preview on generation

---

## License

MIT
