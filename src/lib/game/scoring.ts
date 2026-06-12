// Difficulty-based scoring with streak bonuses.

const BASE_XP: Record<number, number> = {
  1: 10,   // Foundations
  2: 25,   // Intermediate
  3: 50,   // Advanced
  4: 100,  // Research
};

const STREAK_BONUS: Record<number, number> = {
  1: 2,
  2: 5,
  3: 10,
  4: 20,
};

const HINT_PENALTY = 0.5;
const TIMED_MULTIPLIER = 1.5;

export function calculateXp(
  difficulty: number,
  streak: number,
  usedHint: boolean,
  isTimed: boolean
): number {
  const base = BASE_XP[difficulty] || BASE_XP[1];
  const streakBonus = (STREAK_BONUS[difficulty] || STREAK_BONUS[1]) * streak;

  let xp = base + streakBonus;

  if (usedHint) {
    xp = Math.ceil(xp * HINT_PENALTY);
  }

  if (isTimed) {
    xp = Math.ceil(xp * TIMED_MULTIPLIER);
  }

  return Math.max(1, xp);
}
