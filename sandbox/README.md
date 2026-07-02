# vforge Sandbox

Isolated container environment to test the `vforge` plugin without touching your host's `~/.config/opencode`.

## Files

- `Containerfile` — defines the sandbox image (Bun + opencode + isolated user).
- `opencode.json` — isolated OpenCode config that loads `vforge` from `/vforge/dist/plugin.js`.
- `run.sh` — builds the plugin, builds the image, and starts an interactive opencode session.
- `test.sh` — runs a non-interactive smoke test with `/vforge-next`.

## Usage

### Interactive

```bash
./sandbox/run.sh
```

Inside the container, type:

```text
/vforge next landing page premium para analytics SaaS
```

### Non-interactive smoke test

```bash
./sandbox/test.sh
```

This runs:

```bash
opencode run /vforge-next "smoke test prompt"
```

## How it works

- The host `vforge/` directory is mounted read-only at `/vforge`.
- The host `test-project/` directory is mounted read-write at `/project`.
- OpenCode reads its config from `/home/vforge-tester/.config/opencode/opencode.json` inside the container.
- The plugin entry point is `/vforge/dist/plugin.js`, so you must run `bun run build` before testing.

## Notes

- The container uses `--userns=keep-id` so file ownership matches your host user.
- No host AI provider credentials are mounted; configure providers inside the sandbox if you want real generation, or rely on the plugin's local handling.
