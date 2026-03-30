interface NormalizationRule {
  rule: RegExp;
  replacement: string;
}

const normalizations: NormalizationRule[] = [
  { rule: /\\not\s*\\in(?!\w)/g, replacement: String.raw`\notin` },
  { rule: /\\not\s*=/g, replacement: String.raw`\neq` },
  { rule: /\\mid(?!\w)/g, replacement: "|" },
  { rule: /\\Longleftrightarrow(?!\w)/g, replacement: String.raw`\iff ` },
  { rule: /\\Longrightarrow(?!\w)/g, replacement: String.raw`\implies` },
];

try {
  const spaceRule = new RegExp("(?<!\\\\)\\\\ ", "g");
  normalizations.push({ rule: spaceRule, replacement: " " });
} catch {
  // lookbehind not supported
}

export function normalize(input: string): string {
  let result = input;
  normalizations.forEach((rule) => {
    result = result.replace(rule.rule, rule.replacement);
  });
  return result;
}
