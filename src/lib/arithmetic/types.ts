export type ArithmeticCategory =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "mixed"
  | "roots-powers"
  | "percents"
  | "binary"
  | "big-multiply"
  | "big-divide"
  | "big-percents";

export type ArithmeticSubmode = "sqrt" | "square" | "cube";
export type ArithmeticStar = 1 | 2 | 3 | 4 | 5;
export type ArithmeticRunMode = "untimed" | "30s" | "60s" | "120s" | "300s";
export type BigMagnitude = "thousands" | "millions" | "billions";
export type AnswerFormat = "integer" | "decimal" | "fraction" | "binary";

export type ArithmeticCustomConfig = {
  operations: Array<"addition" | "subtraction" | "multiplication" | "division">;
  minDigits: number;
  maxDigits: number;
  allowNegatives: boolean;
  allowDecimals: boolean;
  allowFractions: boolean;
  cleanDivision: boolean;
  percentMode: "part" | "rate" | "base";
};

export type ArithmeticSessionConfig = {
  mode: "standard" | "custom";
  category: ArithmeticCategory;
  submode?: ArithmeticSubmode;
  star: ArithmeticStar;
  runMode: ArithmeticRunMode;
  magnitude?: BigMagnitude;
  customConfig?: ArithmeticCustomConfig;
};

export type ArithmeticProblem = {
  id: string;
  category: ArithmeticCategory;
  submode?: ArithmeticSubmode;
  star: ArithmeticStar;
  expression: string;
  canonicalAnswer: string;
  answerFormat: AnswerFormat;
  acceptsFractions: boolean;
  acceptsDecimals: boolean;
  metadata: Record<string, unknown>;
};

export type ArithmeticAttemptResult = {
  problem: ArithmeticProblem;
  userAnswer: string;
  correct: boolean;
  elapsedMs: number;
  scoreDelta: number;
};

export type Rng = {
  next(): number;
};
