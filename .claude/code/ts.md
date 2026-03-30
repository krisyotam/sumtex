# TypeScript Conventions

## Types

- Interfaces for data shapes (`Problem`, `LeaderboardEntry`).
- Type aliases for unions and computed types.
- No `any`. Use `unknown` and narrow.
- Export types from dedicated files in `src/data/types.ts` or colocated with the module.

## Functions

- Small, pure, single-purpose.
- Prefer named functions over anonymous arrows for top-level definitions.
- No function should exceed ~40 lines. If it does, split it.
- Side effects isolated to a thin entry point.

## Modules

- One concern per file.
- Named exports only. No default exports on utility modules.
- Components are the exception: default export for Next.js compatibility.

## Dependencies

- Zero external deps where possible.
- KaTeX, Firebase, React, Next.js are the budget. Do not add packages without a compelling reason.
- Never add a dependency for something achievable in <20 lines.

## Naming

- Files: PascalCase for components, camelCase for utilities, kebab-case for data files.
- Variables/functions: camelCase.
- Constants: UPPER_SNAKE for true constants, camelCase for computed.
- Interfaces: PascalCase, no `I` prefix.

## Formatting

- 2-space indent.
- Single quotes for strings (except JSX attributes).
- Semicolons on all statements.
- Template literals for interpolation.

## Error Handling

- Let errors propagate to boundaries. No try/catch around everything.
- Firebase operations: catch at the caller, log to console, show user-facing fallback.
- Game logic: no error boundaries needed. If state is invalid, reset to intro.
