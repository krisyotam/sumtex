# Game Design

Core mechanics, scoring, and problem design rules for SumTeX.

## Game Loop

1. Player selects timed (3 min) or zen (unlimited) mode.
2. Problems are presented one at a time, shuffled randomly.
3. Player enters LaTeX answer, sees live preview.
4. On correct answer: score increases, next problem loads after 2s.
5. On wrong answer: "Try Again" feedback, player continues.
6. Player may skip (problem shown in review) or end early.
7. End screen: score summary, leaderboard, skipped problem review.

## Problem Design Principles

### Source Quality

Problems come from real mathematical sources. Acceptable sources:

- Published textbooks (Rudin, Artin, Munkres, Spivak, Apostol, etc.)
- Competition problems (Putnam, IMO, AMC/AIME)
- Classic results and theorems
- Original problems with clear mathematical content

Not acceptable: trivia, trick questions, problems that test LaTeX knowledge rather than math, problems with ambiguous solutions.

### Difficulty Tiers (Planned)

| Tier | Label | Target Audience | Example |
|------|-------|-----------------|---------|
| 1 | Foundations | Calculus / Linear Algebra | Solve x^2 - 5x + 6 = 0 |
| 2 | Intermediate | Upper undergrad | Prove AM-GM for n variables |
| 3 | Advanced | Graduate level | Compute a Galois group |
| 4 | Research | For fun / prestige | Open-adjacent problems |

Tier assignment is editorial. When in doubt, go higher.

### Solution Format

Solutions must be expressible as a single LaTeX string. Problems requiring proof, construction, or extended argument are not suitable for the current answer-checking system. Stick to problems with concrete, verifiable answers: numbers, expressions, equations, sets.

### Hints

A good hint points toward a technique without giving the answer. Examples:

- "Try factoring" (not "Factor as (x-2)(x-3)")
- "Use the power rule" (not "The derivative is 3x^2 + 4x - 1")
- "Apply Cauchy-Schwarz" (not the full inequality statement)

Hints halve the point value. They should be worth the penalty.

## Scoring

Current system (placeholder):

- Base points: `ceil(latex.length / 10)` — longer problems worth more.
- Hint penalty: 50% reduction (minimum 1 point).
- No penalty for wrong answers or skips.
- Timer: 180 seconds in timed mode.

Planned improvements:

- Difficulty-based multipliers replacing length-based scoring.
- Streak bonuses for consecutive correct answers.
- Per-set leaderboards (e.g., "Rudin Chapter 1").

## Leaderboard

- Firebase Firestore, `leaderboard` collection.
- Entries: name (max 30 chars), score, timestamp.
- Display: top 10 filtered by today / this month / all time.
- No auth. Name entry is honor system.
- Anti-abuse measures deferred until there is actual abuse.

## Future Features (Not Yet Implemented)

These are on the roadmap but should NOT be built speculatively:

- **Problem sets**: grouped by textbook/topic, selectable before play.
- **Accounts**: progress tracking, submission history, saved scores.
- **Community submissions**: form or PR-based problem contribution.
- **Multiple solution forms**: accept equivalent LaTeX representations.
- **CAS-based checking**: symbolic comparison instead of string matching.
- **Practice mode**: untimed, focused on a single topic, with explanations.
- **Mobile optimization**: responsive layout, virtual keyboard for LaTeX.
