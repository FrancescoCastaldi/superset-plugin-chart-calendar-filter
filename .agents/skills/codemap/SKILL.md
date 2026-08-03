---
name: codemap
description: Create, maintain, and validate codemap.md architectural map files across repository directories and submodules. Use when generating project structure documentation or fixing codemap MCP lint errors.
---

# Codemap Skill

Use this skill to create, maintain, and validate directory-level `codemap.md` files across projects.

## Structure of a `codemap.md` File

Every `codemap.md` file must follow this exact section layout without leaving placeholder comments:

```markdown
# [folder_path]/

## Responsibility

[Description of what this folder's job is in the system]

## Design

[Key patterns, abstractions, data structures, and architectural decisions used in this folder]

## Flow

[How data and control flow through this specific module/folder]

## Integration

[How this folder connects to other parts of the system and external dependencies]
```

## Rules for Codemap Files

1. **No Placeholder Comments**: Never leave `<!-- Fixer: ... -->` or unpopulated placeholder tags.
2. **Clear Component Boundaries**: Clearly articulate the folder's responsibility, key exported symbols, and data inputs/outputs.
3. **Keep Synchronized**: Update `codemap.md` files whenever new submodules, hooks, components, or utilities are added or modified.
