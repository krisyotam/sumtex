# TSX / React Conventions

## Functions

- Components are functions. No classes.
- One component per file. Exception: tiny helpers used only in that file.
- Extract logic into pure functions outside the component body.
- Prefer `function Foo()` over `const Foo = () =>` for top-level components.
- Hooks at the top, returns at the bottom, logic in between.

## Props

- Destructure in the signature: `function Nav({ items, active }: NavProps)`.
- No prop spreading (`{...props}`) unless forwarding to a single child.
- Default values in destructuring, not `defaultProps`.

## State

- Minimize state. Derive what you can.
- `useState` for local UI. Server components for data.
- Never store derived data in state.
- Game state lives in `Game.tsx`. No global store, no context providers, no reducers.

## Effects

- Every effect must have a clear cleanup or an empty dependency explanation.
- If the effect runs once, comment why.
- Timer effects must clean up on unmount.

## JSX

- No unnecessary fragments. If a single child, no wrapper.
- Conditional rendering: `{condition && <X />}` or early return.
- Keep JSX shallow. If nesting exceeds 4 levels, extract a component.
- Never put `<KaTeX>` inside `<p>` tags. KaTeX renders block elements.

## Imports

- Group: React/Next, third-party, `@/lib`, `@/components`, `@/data`, relative.
- No barrel re-exports.
- Import types with `type` keyword: `import type { Foo } from ...`.

## Naming

- Components: PascalCase filenames matching the export.
- Hooks: `use` prefix, camelCase.
- Utils/helpers: camelCase.

## Formatting

- 2-space indent.
- Double quotes for JSX attributes, single quotes elsewhere.

## Comments

- No JSDoc on components. The types are the docs.
- Comment non-obvious business logic, not React mechanics.
- Follow docs/comments.md for all comment decisions.
