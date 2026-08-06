"use client";

import { MathJax } from "better-react-mathjax";

interface MathDisplayProps {
  latex: string;
  inline?: boolean;
}

export function MathDisplay({ latex, inline = false }: MathDisplayProps) {
  return (
    <span className={inline ? "math-display math-display-inline" : "math-display math-display-block"}>
      <span className="math-display-fallback">{latex}</span>
      <span className="math-display-render">
        <MathJax dynamic inline={inline}>{inline ? `$${latex}$` : `$$${latex}$$`}</MathJax>
      </span>
    </span>
  );
}
