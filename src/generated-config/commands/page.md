---
description: Add a new page to the generated {{FRAMEWORK_LABEL}} app.
agent: vforge-builder
---

# /page

Add a new page to the current project.

Page name: `$ARGUMENTS`

Rules:
- Use kebab-case for the route file name.
- {{PAGE_RULE}}
- Add a link in the main navigation if it makes sense.
- Use existing components and design tokens.
- Run `{{BUILD_CMD}}` after changes.
