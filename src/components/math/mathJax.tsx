"use client";

import { MathJax } from "better-react-mathjax";

interface MathDisplayProps {
  latex: string;
  inline?: boolean;
}

export function MathDisplay({ latex, inline = false }: MathDisplayProps) {
  const wrapped = inline ? `$${latex}$` : `$$${latex}$$`;
  return <MathJax>{wrapped}</MathJax>;
}
