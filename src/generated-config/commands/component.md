---
description: Add a new component to the generated app.
agent: vforge-builder
---

# /component

Add a new component to the current project.

Component name: `$ARGUMENTS`

Rules:
- Place it in `components/` or `components/ui/` as appropriate.
- Use TypeScript and Tailwind.
- Prefer composition; do not over-engineer.
- Export the component as default or named export consistently with the project.
- Run `bun run build` after changes.
