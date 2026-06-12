import { normalize } from "./normalizations";

export type SolutionType = "exact" | "numeric" | "set";

export function checkAnswer(
  userAnswer: string,
  solutions: string[],
  type: SolutionType = "exact"
): boolean {
  if (solutions.length === 0) return false;

  switch (type) {
    case "exact":
      return checkExact(userAnswer, solutions);
    case "numeric":
      return checkNumeric(userAnswer, solutions);
    case "set":
      return checkSet(userAnswer, solutions);
    default:
      return checkExact(userAnswer, solutions);
  }
}

function checkExact(userAnswer: string, solutions: string[]): boolean {
  const normalizedUser = normalize(userAnswer);
  return solutions.some((sol) => normalize(sol) === normalizedUser);
}

function checkNumeric(
  userAnswer: string,
  solutions: string[],
  epsilon = 0.001
): boolean {
  const userNum = parseFloat(userAnswer.replace(/[\\{}$ ]/g, ""));
  if (isNaN(userNum)) return false;

  return solutions.some((sol) => {
    const solNum = parseFloat(sol.replace(/[\\{}$ ]/g, ""));
    if (isNaN(solNum)) return false;
    return Math.abs(userNum - solNum) <= epsilon;
  });
}

function checkSet(userAnswer: string, solutions: string[]): boolean {
  const parseSet = (s: string): string[] =>
    s
      .replace(/[{}\\]/g, "")
      .split(",")
      .map((el) => normalize(el.trim()))
      .filter(Boolean)
      .sort();

  const userSet = parseSet(userAnswer);

  return solutions.some((sol) => {
    const solSet = parseSet(sol);
    if (userSet.length !== solSet.length) return false;
    return userSet.every((el, i) => el === solSet[i]);
  });
}
