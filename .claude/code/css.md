# CSS / Tailwind Conventions

## Philosophy

Minimal CSS. Tailwind for utility. Global styles for game-specific layout. No CSS-in-JS. No styled-components.

## Tailwind

- Use utility classes directly in JSX where appropriate.
- No `@apply` in CSS files.
- Tailwind is available but the game currently uses plain CSS in `globals.css`. Both approaches are acceptable.

## Global Styles

- `globals.css` contains all game styles.
- KaTeX styles imported via `katex/dist/katex.min.css`.
- KaTeX font loaded as `@font-face` from `/fonts/`.
- Game-specific classes: `.latex-button`, `.latex-source`, `.latex`, `.correct`, `.leaderboard-*`.

## Spacing

- Use consistent spacing. The game uses border-box sizing.
- Container: 70% width desktop, 85% mobile (992px breakpoint).
- No magic numbers without a comment explaining the derivation.

## Typography

- Primary font: KaTeX_Main (serif). Loaded from local woff2.
- Code input: Roboto Mono (monospace). Loaded from Google Fonts.
- LaTeX rendering: KaTeX handles its own font stack.

## Colors

- Current palette is minimal: black, white, #eee, #ccc, #0d0 (correct).
- Dark mode is not implemented. When added, use Tailwind `dark:` variant.
- No hex literals scattered in components. Define as CSS variables or Tailwind config when the palette grows.

## Responsive

- Mobile-first is the goal but not yet fully implemented.
- Single breakpoint at 992px for container width.
- Mobile users are warned to switch to desktop (inherited from TeXnique).

## Animation

- Minimal. Correct answer border color change. Button hover transitions.
- No JS-driven animations. CSS transitions only.
- Respect `prefers-reduced-motion` when adding new animations.
