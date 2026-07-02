---
description: Add a new Next.js page to the generated app.
agent: vforge-builder
---

# /page

Add a new page to the current project.

Page name: `$ARGUMENTS`

Rules:
- Use kebab-case for the route file name.
- Create the page under `app/` using Next.js App Router conventions.
- Add a link in the main navigation if it makes sense.
- Use existing components and design tokens.
- Run `bun run build` after changes.
