// LaTeX normalization rules for answer comparison.
// Applied to both user input and canonical solution before string comparison.

type Rule = [RegExp, string];

const rules: Rule[] = [
  // Equivalent command forms
  [/\\not\\in/g, "\\notin"],
  [/\\not=/g, "\\neq"],
  [/\\not =/g, "\\neq"],
  [/\\Longleftrightarrow/g, "\\iff"],
  [/\\Longrightarrow/g, "\\implies"],
  [/\\mid/g, "|"],

  // Whitespace normalization
  [/\\ /g, " "],
  [/\\,/g, ""],
  [/\\;/g, ""],
  [/\\!/g, ""],
  [/\\quad/g, " "],
  [/\\qquad/g, " "],
  [/\s+/g, " "],

  // Remove leading/trailing whitespace
  [/^\s+|\s+$/g, ""],

  // Brace normalization: {x} -> x for single chars
  [/\{([a-zA-Z0-9])\}/g, "$1"],

  // Common equivalences
  [/\\cdot/g, "\\times"],
  [/\\tfrac/g, "\\frac"],
  [/\\dfrac/g, "\\frac"],
];

export function normalize(latex: string): string {
  let result = latex;
  for (const [pattern, replacement] of rules) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
