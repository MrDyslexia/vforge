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

> **Note**: `vforge` is not yet published to npm. Install from source or from a tarball built locally.

### Option 1: Clone and build (recommended for now)

```bash
git clone https://github.com/MrDyslexia/vforge.git
cd vforge
bun install
bun run build
```

Then register the plugin manually in your OpenCode global config.

**Linux/macOS:** edit `~/.config/opencode/opencode.json`

**Windows:** edit `%APPDATA%\opencode\opencode.json`

Add the absolute path to `dist/plugin.js`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "C:/Users/Low/.config/opencode/vforge/dist/plugin.js"
  ]
}
```

Or use the CLI if you want to copy the built files to a stable location first:

```bash
# Copy dist/ to a stable location
mkdir -p ~/.config/opencode/vforge
cp -R dist ~/.config/opencode/vforge/

# Register plugin and copy skills
bunx vforge install
```

**Restart OpenCode** after installing.

### Option 2: Install from a local tarball

Build the tarball in the cloned repo:

```bash
cd vforge
bun run build
npm pack
```

Then, in your project directory:

```bash
bun init -y
bun add -D ./vforge-0.1.0.tgz
bunx vforge install
```

**Restart OpenCode**.

### Option 3: Global install from source

```bash
cd vforge
bun install
bun run build
bun link

# In any project
bun link vforge
bunx vforge install
```

### Verify

```bash
bunx vforge doctor
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

The generated project is placed in `./<slug>/` (relative to the directory where you run OpenCode) by default.

---

## Generated project structure

```text
my-app/
├── app/                    # Next.js App Router
├── components/             # Components
├── lib/                    # Utilities
├── package.json            # Includes vforge as devDependency
├── Containerfile           # Podman/Docker image
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
git clone https://github.com/MrDyslexia/vforge.git
cd vforge
bun install
bun run build
```

Run the install test in a clean Linux container (requires Podman):

```bash
bash sandbox/test-bun-install.sh
```

---

## Troubleshooting

### `Cannot find module '../dist/cli.js'`

You installed from GitHub without building first. `vforge` needs `dist/` to exist. Run `bun run build` and reinstall.

### `ENOENT: no such file or directory, open '...opencode.json.vforge-bak-...'`

Fixed in recent versions. Update to the latest commit and run `bunx vforge install` again.

### `/vforge next` does not appear in OpenCode

Make sure the plugin path is registered correctly and restart OpenCode. On Windows use the absolute path with forward slashes, e.g. `C:/Users/Low/.config/opencode/vforge/dist/plugin.js`.

### Template copy fails with `C:\C:\...`

Fixed in recent versions. Update to the latest commit and rebuild.

---

## Roadmap

- [x] Next.js template
- [x] Living workspace in generated projects
- [x] Windows compatibility
- [ ] Publish to npm
- [ ] CLI `vforge next` without OpenCode running
- [ ] Vue template (`/vforge vue`)
- [ ] Svelte template (`/vforge svelte`)
- [ ] Configurable output directory
- [ ] Automatic Podman preview on generation

---

## License

MIT
