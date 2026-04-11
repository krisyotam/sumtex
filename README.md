# SumTeX

A mathematics game. You get real problems, you solve them in LaTeX.

SumTeX grew out of [TeXnique](https://texnique.xyz), which tested how fast you could reproduce formulas. SumTeX goes further: instead of copying notation, you solve problems. The difference matters. Reproduction tests memory; solving tests understanding.

Problems are drawn from actual textbooks. The goal is to build a large, curated collection spanning undergraduate calculus through graduate algebra and analysis. Rudin, Artin, Munkres, Spivak. Each problem tagged by source, topic, and difficulty.

## Status

Early development. The core game loop works: timed and zen modes, solve and typeset modes, leaderboard via Firebase. Problem sets are small. The project will see heavy development starting mid-2026.

## Stack

- **Next.js** (App Router)
- **KaTeX** for rendering
- **Firebase** (Firestore) for the leaderboard
- **Tailwind CSS**

No other dependencies. That's intentional.

## Game Modes

| Mode | What happens |
|------|-------------|
| Solve | Read a problem, enter the LaTeX solution |
| Typeset | See a rendered formula, reproduce the source (legacy) |
| Timed | 3 minutes |
| Zen | No timer |

Scoring is based on problem length with a hint penalty. This will evolve as difficulty tiers get added.

## Setup

```bash
git clone https://github.com/krisyotam/sumtex.git
cd sumtex
npm install
```

Create `.env.local` with your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

Then run:

```bash
npm run dev
```

## License

MIT
