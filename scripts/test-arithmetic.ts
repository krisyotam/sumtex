import {
  arithmeticCategories,
  checkArithmeticAnswer,
  createSeededRng,
  generateArithmeticProblem,
  scoreArithmeticAttempt,
  type ArithmeticSessionConfig,
  type ArithmeticStar,
} from "../src/lib/arithmetic";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const stars: ArithmeticStar[] = [1, 2, 3, 4, 5];

for (const category of arithmeticCategories) {
  for (const star of stars) {
    const config: ArithmeticSessionConfig = {
      mode: "standard",
      category: category.id,
      submode: category.id === "roots-powers" ? "sqrt" : undefined,
      star,
      runMode: "60s",
      magnitude: category.id.startsWith("big-") ? "thousands" : undefined,
    };
    const rng = createSeededRng(star * 1000 + category.id.length);

    for (let index = 0; index < 25; index += 1) {
      const problem = generateArithmeticProblem(config, rng);
      assert(problem.expression.length > 0, `${category.id} produced empty expression`);
      assert(problem.canonicalAnswer.length > 0, `${category.id} produced empty answer`);
      assert(
        checkArithmeticAnswer(problem, problem.canonicalAnswer),
        `${category.id} failed canonical answer check`
      );
      assert(
        scoreArithmeticAttempt({ correct: true, elapsedMs: 1000, problem }, config) > 0,
        `${category.id} failed positive scoring`
      );
      assert(
        scoreArithmeticAttempt({ correct: false, elapsedMs: 1000, problem }, config) === 0,
        `${category.id} failed incorrect scoring`
      );
    }
  }
}

const fractionConfig: ArithmeticSessionConfig = {
  mode: "standard",
  category: "division",
  star: 5,
  runMode: "60s",
};
const fractionProblem = {
  ...generateArithmeticProblem(fractionConfig, createSeededRng(9)),
  canonicalAnswer: "1/2",
  answerFormat: "fraction" as const,
};

assert(checkArithmeticAnswer(fractionProblem, "0.5"), "0.5 should equal 1/2");
assert(checkArithmeticAnswer(fractionProblem, "2/4"), "2/4 should equal 1/2");
assert(!checkArithmeticAnswer(fractionProblem, "0.6"), "0.6 should not equal 1/2");

const binaryProblem = generateArithmeticProblem(
  { mode: "standard", category: "binary", star: 2, runMode: "60s" },
  createSeededRng(12)
);
assert(/^[01]+$/.test(binaryProblem.canonicalAnswer), "binary answer should be base two");
assert(checkArithmeticAnswer(binaryProblem, binaryProblem.canonicalAnswer), "binary answer failed");

console.log("arithmetic tests passed");
