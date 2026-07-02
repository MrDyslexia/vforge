---
description: Evolve or refactor the generated app from a new prompt.
agent: vforge-builder
---

# /iterate

Evolve the current project based on the user's request.

User request: `$ARGUMENTS`

Read `PROJECT.md` first to understand the original intent, stack, and constraints.

Rules:
- Prefer minimal, purposeful changes.
- Maintain the existing visual direction unless the user asks to change it.
- Keep mock data unless the user explicitly asks for backend/API/database.
- Run `bun run build` after changes.
- Update `PROJECT.md` with a brief log of what changed.
