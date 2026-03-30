# CLAUDE.md — SumTeX

Project: SumTeX | Author: Kris Yotam | Updated: 2026-03-29

## .claude/ Structure

```
.claude/
├── CLAUDE.md              ← You are here. Core rules and quick reference.
├── docs/                  ← Project standards and conventions.
│   ├── comments.md        — Comment philosophy: Gwern-style, anti-patterns, density rules.
│   ├── headers.md         — File header templates for every source file type.
│   └── game-design.md     — Game mechanics, scoring, problem format, difficulty tiers.
└── code/                  ← Language-specific coding guides.
    ├── tsx.md             — React component conventions.
    ├── ts.md              — TypeScript conventions (lib, data, utils).
    └── css.md             — Tailwind/CSS patterns and constraints.
```

**docs/** contains project-wide standards that apply regardless of language. Read the relevant doc before working in that area.

**code/** contains language-specific rules for how code is written and maintained within SumTeX. Consult before writing code in any language.

**comments.md** (in docs/) governs all inline comments across every language. It overrides any language-specific comment habits. Read it once, obey it always.

---

## 1. Mission

SumTeX is a mathematics game. Not a LaTeX typing test. Not a quiz app with multiple choice.

Players receive genuine problems drawn from quality textbooks and mathematical writing. They solve them by entering LaTeX. The problems are hard. The game rewards fluency in both mathematical reasoning and notation. The community (starting with Kris) curates every problem set.

The original TeXnique asked players to reproduce formulas. SumTeX asks players to solve problems. The distinction is fundamental: reproduction tests memory; solving tests understanding. SumTeX is for people who want to get better at mathematics, not people who want to type faster.

Long-term goals:

- **Problem sets from real textbooks.** Rudin, Artin, Munkres, Spivak, Atiyah-Macdonald. Each set tagged by source, topic, and difficulty.
- **Community-curated content.** Problem submissions, solutions, and hints reviewed before inclusion.
- **Difficulty tiers.** From undergraduate calculus to graduate algebra and analysis.
- **No accounts yet.** The game works without auth. Leaderboard uses name entry. Accounts come later when there is a reason for them (progress tracking, problem submission).
- **Public and free.** No paywalls, no ads, no tracking beyond what Firebase provides for the leaderboard.

---

## 2. Philosophy

Built on the same principles as krisyotam.com: FSF, Unix Way, Suckless Manifesto.

- **No dependencies unless forced.** KaTeX for rendering, Firebase for leaderboard, Next.js for the framework. That is the dependency budget. Do not add npm packages without a compelling reason.
- **Components do one thing.** Split when they start doing two.
- **Static by default.** The game is client-rendered but the shell is static. No server-side data fetching for gameplay.
- **JS bundle only shrinks.** Every change should leave the bundle equal or smaller.
- **Problems are data, not code.** Problem sets live in `src/data/` as typed arrays. They are not embedded in components.
- **KaTeX over MathJax.** Faster, smaller, sufficient. Do not introduce MathJax.
- **No jQuery.** The original TeXnique used jQuery. SumTeX uses React. Do not reintroduce jQuery or any DOM manipulation library.

---

## 3. Architecture

### Directory Layout

```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout (fonts, metadata, global CSS)
│   ├── page.tsx           # Home page (renders Game)
│   └── globals.css        # Global styles + KaTeX + Tailwind
├── components/            # React components
│   ├── Game.tsx           # Main game state machine (intro → playing → ended)
│   ├── KaTeX.tsx          # KaTeX rendering wrapper (<span>-based, inline-safe)
│   └── Leaderboard.tsx    # Firebase leaderboard (submit, filter, display)
├── data/                  # Problem sets and game data
│   ├── types.ts           # Problem interface definition
│   ├── normalizations.ts  # LaTeX normalization rules for answer comparison
│   ├── problems-demo.ts   # Solve-mode problems (with solutions + hints)
│   └── problems-typesetting.ts  # Legacy typesetting problems (reproduce formula)
└── lib/                   # Shared utilities
    └── firebase.ts        # Firebase app + Firestore initialization
```

### Game Modes

| Mode | Source | Mechanic |
|------|--------|----------|
| Solve | `problems-demo.ts` | Player reads problem, enters LaTeX solution. Checked against `solution` field. |
| Typeset | `problems-typesetting.ts` | Player sees rendered formula, reproduces the LaTeX source. Legacy mode from TeXnique. |

The game auto-selects solve mode when problems have `solution` fields. As problem sets grow, the typesetting mode will be deprecated or relegated to a separate practice mode.

### State Machine

```
intro → playing → ended → intro
```

`Game.tsx` manages all state. No global store, no context providers, no reducers. When the game grows complex enough to warrant state extraction, use a custom hook, not a state library.

---

## 4. Problem Format

Every problem is a `Problem` object:

```ts
interface Problem {
  title: string       // Display name (e.g., "Basic Quadratic Equation")
  description: string // Brief context or source attribution
  latex: string       // The problem statement, rendered via KaTeX
  solution?: string   // Expected answer in LaTeX (for solve mode)
  hint?: string       // Optional hint, shown at point cost
}
```

### Rules for Adding Problems

- Every new problem MUST have a `solution` field. Typesetting-only problems (no solution) are legacy.
- `latex` is the problem statement. It should be a complete, well-formed mathematical expression or equation.
- `solution` is the canonical answer. Normalization handles minor formatting differences.
- `hint` is optional. If provided, viewing it halves the point value.
- `title` should name the theorem, technique, or topic. Not "Problem 47".
- `description` should credit the source: textbook name, author, problem number when known.

### Future: Problem Sets

Problems will eventually be organized into sets (by textbook, by topic, by difficulty). The data model will expand but the core `Problem` interface will remain the unit of play.

---

## 5. Answer Checking

Answers are compared as normalized LaTeX strings. The normalization pipeline (`src/data/normalizations.ts`) applies regex rules to handle equivalent notations:

- `\not\in` → `\notin`
- `\not=` → `\neq`
- `\mid` → `|`
- `\Longleftrightarrow` → `\iff`
- `\Longrightarrow` → `\implies`
- Escaped spaces → literal spaces

This is fragile. Long-term, answer checking should compare rendered output or use a CAS. For now, string comparison with normalization is the mechanism. When it fails, the fix is to add a normalization rule or accept multiple solution forms, not to switch to a different comparison strategy without a plan.

---

## 6. Firebase

Firestore is used exclusively for the leaderboard. The game itself has no server dependency.

- Project: `texnique-v3` (inherited from the original TeXnique fork)
- Collection: `leaderboard` (fields: `name`, `score`, `timestamp`)
- Queries: filtered by time range (today, month, all-time), ordered by score descending, limited to 10

The Firebase config is committed to the repo. This is a public game with a public leaderboard. The API key is restricted to Firestore reads/writes on the `leaderboard` collection. Do not add Firebase Auth or any other Firebase service without explicit instruction.

---

## 7. Scoring

- Points per problem: `ceil(latex.length / 10)`
- Hint penalty: points halved (minimum 1)
- Timed mode: 3 minutes
- Zen mode: no timer

Scoring will evolve. Difficulty-based multipliers, streak bonuses, and problem-set-specific scoring are all on the table. The current system is a placeholder.

---

## 8. Builds

### ABSOLUTE RULE: DO NOT BUILD UNLESS TOLD

**NEVER** run `npm run build`, `npm run dev`, or ANY build/compile command unless Kris **explicitly** says "build" or "dev server" in his message. This has frozen the system. No exceptions. Tell Kris and let him decide.

When asked: `npm run dev` for development, `npm run build` for production.

---

## 9. Git Commits

Standard git workflow. No special commit script. Write clear, concise commit messages. Do not add Co-Authored-By lines.

---

## 10. Writing Style

- Write plainly. Short sentences. No filler.
- Never use em dashes. Use periods, commas, or restructure.
- Never open with "A comprehensive..." or "An overview of..."
- Banned words: "explore", "delve", "leverage", "utilize", "facilitate", "landscape", "robust", "streamline", "cutting-edge", "dive into", "harness"
- No padding: "various", "numerous", "a wide range of", "and more", "etc."
- No exclamation marks in descriptions.
- Prefer "is" over "serves as". Prefer "for" over "in order to".

---

## 11. HTML Nesting

KaTeX renders block-level content. The `KaTeX` component uses `<span>` to stay inline-safe. Title and subtitle wrappers use `<div>`, not `<p>`, to avoid hydration errors from invalid nesting. Never put `<KaTeX>` inside `<p>` tags unless you are certain the rendered output contains no block elements.

---

## 12. Constants

- Owner: **Kris Yotam**
- Game name: **SumTeX** (capital S, capital T, capital X)
- LaTeX rendering: **Sum\TeX** (the TeX ligature)
- Firebase project: `texnique-v3`
- Default timer: 180 seconds
