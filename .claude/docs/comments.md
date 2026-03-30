# Comments

Rules for code comments across all languages in SumTeX. Modeled on Gwern.net's commenting philosophy: high-signal, decision-documenting, reference-dense.

## Core Rule

A comment exists to record something the code cannot say. If the code says it, the comment is noise. Delete it.

## What Good Comments Do

### 1. Explain WHY, never WHAT

```ts
// Bad — restates the code
// Set the timeout to 180 seconds
const TIMEOUT_SECONDS = 180

// Good — explains the decision
// 3 minutes matches the original TeXnique timer. Playtesters found
// shorter times frustrating for solve-mode problems.
const TIMEOUT_SECONDS = 180
```

### 2. Reference external sources

Link to the spec, bug report, or documentation that informed the decision.

```ts
// KaTeX \verb command requires delimiter characters around the content.
// See: https://katex.org/docs/supported#verb
```

### 3. Name the browser, tool, or platform

Never write "fix bug" or "workaround for issue." Name it.

```ts
// Force reflow to work around Chrome 120+ not updating transforms
// after dynamic class changes. Chromium bug #1234567.
elem.offsetHeight
```

### 4. Document edge cases

```ts
// Normalization is order-dependent: \not\in must be caught before
// generic \not patterns, or it produces \no\tin garbage.
```

### 5. Preserve hard-won lessons

Use WARNING for constraints that caused bugs when violated.

```ts
// WARNING: KaTeX renders block elements inside <span> when displayMode
// is true. Never wrap <KaTeX> in <p> tags — causes hydration errors.
```

### 6. Surface assumptions

```ts
// Assumes problem solutions are unique after normalization.
// If two problems share a normalized solution, the wrong one may
// be marked correct when problems are randomized.
```

## Anti-Patterns (All Banned)

1. **Restating the code.** `// Import katex` above `import katex`. Delete.
2. **Narrating control flow.** `// Check if correct` above `if (answer === correct)`. Delete.
3. **Section dividers.** `// ===== IMPORTS =====`. The code structure is the structure.
4. **Apologetic comments.** `// HACK: not sure why this works`. Investigate or fix.
5. **Changelog comments.** `// Added 2026-03-29`. That is what git blame is for.
6. **Type-restating JSDoc.** If the TypeScript signature says it, the JSDoc is noise.
7. **Commented-out code.** Dead code is dead. Delete it. Git has it.

## Comment Density

A 200-line file might have 5-10 comments. If it has 50, most are noise. Comments appear at decision points, not at every line.
