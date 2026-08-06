import type {
  ArithmeticAttemptResult,
  ArithmeticCategory,
  ArithmeticCustomConfig,
  ArithmeticProblem,
  ArithmeticSessionConfig,
  ArithmeticStar,
  AnswerFormat,
  BigMagnitude,
  Rng,
} from "./types";

const STAR_DIGITS: Record<ArithmeticStar, [number, number]> = {
  1: [1, 1],
  2: [1, 2],
  3: [2, 2],
  4: [2, 3],
  5: [3, 3],
};

const BIG_RANGES: Record<BigMagnitude, [number, number]> = {
  thousands: [1_000, 9_999],
  millions: [1_000_000, 9_999_999],
  billions: [1_000_000_000, 9_999_999_999],
};

export function createSeededRng(seed: number): Rng {
  let state = seed >>> 0;

  return {
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function defaultCustomConfig(): ArithmeticCustomConfig {
  return {
    operations: ["addition", "subtraction", "multiplication", "division"],
    minDigits: 1,
    maxDigits: 2,
    allowNegatives: false,
    allowDecimals: false,
    allowFractions: true,
    cleanDivision: true,
    percentMode: "part",
  };
}

export function generateArithmeticProblem(
  config: ArithmeticSessionConfig,
  rng: Rng
): ArithmeticProblem {
  const category: ArithmeticCategory =
    config.mode === "custom" ? pick(rng, config.customConfig?.operations ?? ["addition"]) : config.category;
  const resolvedConfig = { ...config, category };

  switch (category) {
    case "addition":
      return binaryOpProblem(resolvedConfig, rng, "+", (a, b) => a + b);
    case "subtraction":
      return binaryOpProblem(resolvedConfig, rng, "-", (a, b) => a - b);
    case "multiplication":
      return binaryOpProblem(resolvedConfig, rng, "x", (a, b) => a * b);
    case "division":
      return divisionProblem(resolvedConfig, rng);
    case "mixed":
      return mixedProblem(resolvedConfig, rng);
    case "roots-powers":
      return rootsPowersProblem(resolvedConfig, rng);
    case "percents":
      return percentProblem(resolvedConfig, rng);
    case "binary":
      return binaryModeProblem(resolvedConfig, rng);
    case "big-multiply":
      return bigMultiplyProblem(resolvedConfig, rng);
    case "big-divide":
      return bigDivideProblem(resolvedConfig, rng);
    case "big-percents":
      return bigPercentProblem(resolvedConfig, rng);
  }
}

export function checkArithmeticAnswer(problem: ArithmeticProblem, userAnswer: string): boolean {
  if (problem.answerFormat === "binary") {
    const cleaned = userAnswer.trim().replace(/^0b/i, "");
    return /^[01]+$/.test(cleaned) && cleaned.replace(/^0+(?=\d)/, "") === problem.canonicalAnswer;
  }

  const expected = parseRational(problem.canonicalAnswer);
  const actual = parseRational(userAnswer);

  if (!expected || !actual) {
    return false;
  }

  return expected.num === actual.num && expected.den === actual.den;
}

export function scoreArithmeticAttempt(
  attempt: Pick<ArithmeticAttemptResult, "correct" | "elapsedMs" | "problem">,
  session: Pick<ArithmeticSessionConfig, "runMode">
): number {
  if (!attempt.correct) {
    return 0;
  }

  const star = attempt.problem.star;
  const base = 8 + star * 4;
  const speed = session.runMode === "untimed" ? 1 : Math.max(1, 4 - Math.floor(attempt.elapsedMs / 2500));
  const categoryBonus = attempt.problem.category.startsWith("big-") ? 8 : 0;

  return base + speed + categoryBonus;
}

function binaryOpProblem(
  config: ArithmeticSessionConfig,
  rng: Rng,
  symbol: string,
  solve: (a: number, b: number) => number
): ArithmeticProblem {
  const { a, b } = operandsFor(config, rng);
  return makeProblem(config, `${a} ${symbol} ${b}`, String(solve(a, b)), "integer");
}

function divisionProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const [minDigits, maxDigits] = digitRange(config);
  const divisor = randDigits(rng, minDigits, Math.max(minDigits, maxDigits - 1));
  const quotient = randDigits(rng, minDigits, maxDigits);
  const clean = config.mode !== "custom" || config.customConfig?.cleanDivision !== false;

  if (clean || config.star <= 3) {
    return makeProblem(config, `${divisor * quotient} / ${divisor}`, String(quotient), "integer");
  }

  const dividend = divisor * quotient + randInt(rng, 1, divisor - 1);
  return makeProblem(config, `${dividend} / ${divisor}`, reduceFraction(dividend, divisor), "fraction", {
    acceptsFractions: true,
    acceptsDecimals: true,
  });
}

function mixedProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const op = pick(rng, ["addition", "subtraction", "multiplication", "division"] as const);
  return generateArithmeticProblem({ ...config, category: op }, rng);
}

function rootsPowersProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const submode = config.submode ?? "square";
  const star = config.star;
  const maxBase = submode === "cube" ? 5 + star * 5 : 10 + star * 18;
  const base = randInt(rng, Math.max(2, star), maxBase);

  if (submode === "sqrt") {
    return makeProblem(
      { ...config, submode },
      `sqrt(${base * base})`,
      String(base),
      "integer"
    );
  }

  const power = submode === "cube" ? 3 : 2;
  return makeProblem(
    { ...config, submode },
    `${base}^${power}`,
    String(Math.pow(base, power)),
    "integer"
  );
}

function percentProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const rates = [5, 10, 12.5, 15, 20, 25, 30, 40, 50, 75];
  const rate = config.star >= 4 ? randInt(rng, 2, 95) : pick(rng, rates);
  const base = randInt(rng, 2, 20 + config.star * 30) * 4;
  const answer = (base * rate) / 100;

  return makeProblem(config, `${formatNumber(rate)}% of ${base}`, formatNumber(answer), "decimal", {
    acceptsFractions: true,
    acceptsDecimals: true,
  });
}

function binaryModeProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const max = Math.pow(2, 3 + config.star) - 1;
  const a = randInt(rng, 1, max);
  const b = randInt(rng, 1, max);
  const op = pick(rng, ["+", "-", "x"] as const);
  const left = op === "-" ? Math.max(a, b) : a;
  const right = op === "-" ? Math.min(a, b) : b;
  const answer = op === "+" ? left + right : op === "-" ? left - right : left * right;

  return makeProblem(
    config,
    `${left.toString(2)} ${op} ${right.toString(2)}`,
    answer.toString(2),
    "binary"
  );
}

function bigMultiplyProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const magnitude = config.magnitude ?? "thousands";
  const [min, max] = BIG_RANGES[magnitude];
  const a = randInt(rng, min, max);
  const b = randDigits(rng, Math.max(1, config.star - 1), Math.min(3, config.star));

  return makeProblem(config, `${a} x ${b}`, String(a * b), "integer", { magnitude });
}

function bigDivideProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const magnitude = config.magnitude ?? "thousands";
  const [min, max] = BIG_RANGES[magnitude];
  const quotient = randInt(rng, min, max);
  const divisor = randDigits(rng, 1, Math.min(3, config.star));

  return makeProblem(config, `${quotient * divisor} / ${divisor}`, String(quotient), "integer", {
    magnitude,
  });
}

function bigPercentProblem(config: ArithmeticSessionConfig, rng: Rng): ArithmeticProblem {
  const magnitude = config.magnitude ?? "thousands";
  const [min, max] = BIG_RANGES[magnitude];
  const base = randInt(rng, min, max);
  const rate = config.star <= 2 ? pick(rng, [1, 5, 10, 20, 25, 50]) : randInt(rng, 2, 35);
  const answer = (base * rate) / 100;

  return makeProblem(config, `${rate}% of ${base}`, formatNumber(answer), "decimal", {
    magnitude,
    acceptsFractions: true,
    acceptsDecimals: true,
  });
}

function operandsFor(config: ArithmeticSessionConfig, rng: Rng) {
  const [minDigits, maxDigits] = digitRange(config);
  let a = randDigits(rng, minDigits, maxDigits);
  let b = randDigits(rng, minDigits, maxDigits);

  if (config.mode === "custom" && config.customConfig?.allowNegatives) {
    a *= rng.next() < 0.3 ? -1 : 1;
    b *= rng.next() < 0.3 ? -1 : 1;
  }

  if (config.category === "subtraction" && config.mode !== "custom" && b > a) {
    [a, b] = [b, a];
  }

  return { a, b };
}

function digitRange(config: ArithmeticSessionConfig): [number, number] {
  if (config.mode === "custom" && config.customConfig) {
    return [
      clamp(Math.floor(config.customConfig.minDigits), 1, 9),
      clamp(Math.floor(config.customConfig.maxDigits), 1, 9),
    ];
  }

  return STAR_DIGITS[config.star];
}

function makeProblem(
  config: ArithmeticSessionConfig,
  expression: string,
  canonicalAnswer: string,
  answerFormat: AnswerFormat,
  options: Record<string, unknown> = {}
): ArithmeticProblem {
  return {
    id: crypto.randomUUID(),
    category: config.category,
    submode: config.submode,
    star: config.star,
    expression,
    canonicalAnswer,
    answerFormat,
    acceptsFractions: Boolean(options.acceptsFractions) || answerFormat === "fraction",
    acceptsDecimals: Boolean(options.acceptsDecimals) || answerFormat === "decimal",
    metadata: options,
  };
}

function randDigits(rng: Rng, minDigits: number, maxDigits: number): number {
  const loDigits = Math.min(minDigits, maxDigits);
  const hiDigits = Math.max(minDigits, maxDigits);
  const digits = randInt(rng, loDigits, hiDigits);
  const min = digits === 1 ? 1 : Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return randInt(rng, min, max);
}

function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng.next() * (max - min + 1)) + min;
}

function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng.next() * items.length)]!;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}

type Rational = {
  num: number;
  den: number;
};

function parseRational(input: string): Rational | null {
  const value = input.trim().replace(/\s+/g, "");

  if (!value) {
    return null;
  }

  if (/^-?\d+\/-?\d+$/.test(value)) {
    const [rawNum, rawDen] = value.split("/");
    const den = Number(rawDen);
    if (den === 0) {
      return null;
    }
    return normalize({ num: Number(rawNum), den });
  }

  if (/^-?(?:\d+|\d*\.\d+)$/.test(value)) {
    const negative = value.startsWith("-");
    const unsigned = negative ? value.slice(1) : value;
    const [whole, decimal = ""] = unsigned.split(".");
    const den = Math.pow(10, decimal.length);
    const num = Number((whole || "0") + decimal) * (negative ? -1 : 1);
    return normalize({ num, den });
  }

  return null;
}

function reduceFraction(num: number, den: number): string {
  const rational = normalize({ num, den });
  return rational.den === 1 ? String(rational.num) : `${rational.num}/${rational.den}`;
}

function normalize(rational: Rational): Rational {
  let { num, den } = rational;

  if (den < 0) {
    num = -num;
    den = -den;
  }

  const divisor = gcd(abs(num), den);
  return {
    num: num / divisor,
    den: den / divisor,
  };
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function abs(value: number): number {
  return value < 0 ? -value : value;
}

export const arithmeticCategories: Array<{
  id: ArithmeticCategory;
  label: string;
  description: string;
}> = [
  { id: "addition", label: "Addition", description: "Fast integer sums" },
  { id: "subtraction", label: "Subtraction", description: "Positive and signed differences" },
  { id: "multiplication", label: "Multiplication", description: "Tables through three digits" },
  { id: "division", label: "Division", description: "Clean division, then fractions" },
  { id: "mixed", label: "Mixed ops", description: "Rotating arithmetic operators" },
  { id: "roots-powers", label: "Roots and powers", description: "Square roots, squares, cubes" },
  { id: "percents", label: "Percents", description: "Everyday percent calculations" },
  { id: "binary", label: "Binary", description: "Base-two arithmetic" },
  { id: "big-multiply", label: "Big multiply", description: "Large numbers by smaller factors" },
  { id: "big-divide", label: "Big divide", description: "Large clean quotients" },
  { id: "big-percents", label: "Big percents", description: "Percent work on large quantities" },
];
