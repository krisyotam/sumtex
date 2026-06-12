# CLAUDE.md -- SumTeX v3

Project: SumTeX | Author: Kris Yotam | Updated: 2026-06-02

---

## 1. Mission

SumTeX is HackTheBox for mathematics. Problems from real textbooks, solved in LaTeX. The suckless approach: textbooks are king, written word and repetition over videos.

Players solve genuine problems from Rudin, Spivak, Artin, Munkres. They track progress across math areas via spider graphs, work through textbook paths, and contribute problems to the community. AI translates screenshots into MathJax via BYOK keys.

---

## 2. Philosophy

FSF, Unix Way, Suckless Manifesto, Plan 9.

- **10 runtime deps.** next, react, react-dom, postgres, drizzle-orm, @workos-inc/authkit-nextjs, better-react-mathjax, geist, server-only, zod. Do not add packages without explicit instruction.
- **Components do one thing.** Split when they do two.
- **MathJax for rendering.** Broader LaTeX coverage for real textbook problems.
- **Problems live in Postgres.** Not in code files. Database is the source of truth.
- **JS bundle only shrinks.** No charting libraries (spider graph is hand-rolled SVG).
- **No jQuery, no Firebase.** v2 used Firebase. v3 uses self-hosted Postgres on STARGATE.

---

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Auth | WorkOS AuthKit (`@workos-inc/authkit-nextjs`) |
| Database | Self-hosted Postgres on STARGATE |
| ORM | Drizzle + drizzle-kit |
| Math | MathJax via `better-react-mathjax` |
| Styling | Tailwind 4 + CSS variables |
| Fonts | Geist Sans + Geist Mono |

---

## 4. Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Geist fonts, theme, MathJax)
│   ├── globals.css               # Color scheme from notes.krisyotam.com
│   ├── page.tsx                  # Landing page
│   ├── callback/route.ts         # WorkOS auth callback
│   ├── sign-in/route.ts          # WorkOS sign-in redirect
│   ├── (app)/                    # Authenticated routes
│   │   ├── play/                 # Game modes (timed/zen)
│   │   ├── problems/            # Browse, view, submit problems
│   │   ├── paths/               # Textbook paths
│   │   ├── roadmaps/            # Multi-subject learning paths
│   │   ├── collections/         # Curated problem sets
│   │   ├── leaderboard/         # Rankings
│   │   ├── forum/               # Discussion
│   │   ├── profile/             # Edit profile + settings
│   │   └── u/[username]/        # Public profiles
│   └── api/                     # API routes
├── components/
│   ├── ui/                      # Primitives
│   ├── math/                    # MathJax wrapper + provider
│   ├── game/                    # Game shell, problem cards, timer
│   ├── profile/                 # Spider graph, profile card
│   ├── forum/                   # Thread/reply components
│   └── navigation/              # Header
├── lib/
│   ├── db/                      # Drizzle schema, connection, migrations
│   ├── auth/                    # WorkOS session helpers
│   ├── ai/                      # BYOK encryption, providers, screenshot
│   ├── game/                    # Scoring, answer checking, normalizations
│   ├── theme.tsx                # Light/dark theme provider
│   └── utils.ts                 # Utilities
├── hooks/                       # React hooks
├── types/                       # TypeScript types (inferred from Drizzle)
scripts/
├── seed.ts                      # Seed subjects + forum categories
└── migrate.ts                   # Run migrations
proxy.ts                         # WorkOS AuthKit proxy (Next.js 16)
```

---

## 5. Component Naming

camelCase filenames: `gameShell.tsx`, `spiderGraph.tsx`, `mathJax.tsx`

---

## 6. Scoring

| Difficulty | Base XP | Hint Penalty | Streak Bonus |
|-----------|---------|-------------|-------------|
| 1 (Foundations) | 10 | -50% | +2/consecutive |
| 2 (Intermediate) | 25 | -50% | +5/consecutive |
| 3 (Advanced) | 50 | -50% | +10/consecutive |
| 4 (Research) | 100 | -50% | +20/consecutive |

Timed mode: 1.5x multiplier. Streak resets on skip or wrong answer.

---

## 7. Answer Checking

Three solution types in `src/lib/game/checker.ts`:

- **exact**: Normalize both strings, compare. Normalization rules in `normalizations.ts`.
- **numeric**: Parse as numbers, compare within epsilon (0.001).
- **set**: Parse as comma-separated, normalize each, compare as unordered sets.

`problem_solutions` table allows multiple accepted forms per problem.

---

## 8. Builds

### ABSOLUTE RULE: DO NOT BUILD UNLESS TOLD

**NEVER** run `npm run build`, `npm run dev`, or ANY build/compile command unless Kris **explicitly** says "build" or "dev server" in his message. No exceptions.

---

## 9. Git Commits

Standard git workflow. Clear, concise messages. No Co-Authored-By lines.

---

## 10. Writing Style

- Write plainly. Short sentences. No filler.
- Never use em dashes. Use periods, commas, or restructure.
- Banned words: "explore", "delve", "leverage", "utilize", "facilitate", "landscape", "robust", "streamline", "cutting-edge", "dive into", "harness"
- No exclamation marks in descriptions.

---

## 11. Constants

- Owner: **Kris Yotam**
- Game name: **SumTeX** (capital S, capital T, capital X)
- LaTeX rendering: **Sum\TeX** (the TeX ligature)
- Default timer: 180 seconds
