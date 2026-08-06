import type { ReactNode } from "react";
import { MathDisplay } from "@/components/math/mathJax";

export type Guide = {
  slug: string;
  title: string;
  dek: string;
  author: string;
  source: "Platform" | "User";
  level: string;
  readTime: string;
  tags: string[];
  updatedAt: string;
  sections: Array<{
    heading: string;
    body: ReactNode;
  }>;
};

export const guides: Guide[] = [
  {
    slug: "algebraic-factoring-field-guide",
    title: "A field guide to algebraic factoring",
    dek: "Recognize the common shapes behind school algebra before the symbols get noisy.",
    author: "@krisyotam",
    source: "Platform",
    level: "Algebra",
    readTime: "9 min",
    tags: ["algebra", "factoring", "patterns"],
    updatedAt: "July 14, 2026",
    sections: [
      {
        heading: "The point",
        body: (
          <>
            <p>
              Factoring is pattern recognition with a proof attached. You are rewriting one expression as a product so that roots, signs, and cancellations become visible.
            </p>
            <MathDisplay latex="x^2 + 5x + 6 = (x + 2)(x + 3)" />
            <p>
              The right side is not a trick. It expands back into the left side, so the rewrite preserves the expression while revealing its structure.
            </p>
          </>
        ),
      },
      {
        heading: "Start with the greatest common factor",
        body: (
          <>
            <p>
              Before looking for a famous pattern, remove anything shared by every term. This reduces the work and keeps later steps smaller.
            </p>
            <MathDisplay latex="12x^3 - 18x^2 = 6x^2(2x - 3)" />
          </>
        ),
      },
      {
        heading: "Quadratics by sum and product",
        body: (
          <>
            <p>
              For a monic quadratic, find two numbers whose product is the constant term and whose sum is the linear coefficient.
            </p>
            <MathDisplay latex="x^2 + bx + c = (x + m)(x + n), \\quad m+n=b, \\quad mn=c" />
            <p>
              This test is fast because it turns a symbolic problem into a short integer search.
            </p>
          </>
        ),
      },
      {
        heading: "Difference of squares",
        body: (
          <>
            <p>
              Two square terms separated by subtraction factor into conjugates. The middle terms cancel during expansion.
            </p>
            <MathDisplay latex="a^2 - b^2 = (a-b)(a+b)" />
            <p>
              Typical examples include $x^2 - 49$, $9y^2 - 4$, and $16m^4 - n^2$.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "limits-without-mysticism",
    title: "Limits without mysticism",
    dek: "A first calculus guide for reading limit notation as a claim about control.",
    author: "@krisyotam",
    source: "User",
    level: "Calculus",
    readTime: "11 min",
    tags: ["calculus", "limits", "epsilon delta"],
    updatedAt: "July 14, 2026",
    sections: [
      {
        heading: "What a limit says",
        body: (
          <>
            <p>
              A limit is not asking what happens at a single point. It asks what values can be forced near a target by choosing inputs close enough to a point.
            </p>
            <MathDisplay latex="\\lim_{x \\to a} f(x) = L" />
            <p>
              Read this as: values of $f(x)$ can be made arbitrarily close to $L$ by taking $x$ close enough to $a$.
            </p>
          </>
        ),
      },
      {
        heading: "The epsilon delta form",
        body: (
          <>
            <p>
              The formal definition turns closeness into two tolerances. Epsilon measures output error. Delta measures input distance.
            </p>
            <MathDisplay latex="0 < |x-a| < \\delta \\implies |f(x)-L| < \\varepsilon" />
            <p>
              The game is to pick a delta that works for any requested epsilon.
            </p>
          </>
        ),
      },
      {
        heading: "A linear example",
        body: (
          <>
            <p>
              For $f(x)=3x+1$ at $x=2$, the expected limit is $7$. The error simplifies cleanly.
            </p>
            <MathDisplay latex="|(3x+1)-7| = |3x-6| = 3|x-2|" />
            <p>
              Choosing $\delta = \varepsilon/3$ makes the output error smaller than epsilon.
            </p>
          </>
        ),
      },
      {
        heading: "Why this matters",
        body: (
          <>
            <p>
              Derivatives, continuity, and integrals all depend on limits. The notation is compact, but the underlying idea is consistent: control output behavior by controlling input behavior.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "complex-numbers-as-geometry",
    title: "Complex numbers as geometry",
    dek: "Use the plane, not just rules, to understand multiplication by complex numbers.",
    author: "@krisyotam",
    source: "Platform",
    level: "Complex Analysis",
    readTime: "8 min",
    tags: ["complex numbers", "geometry", "analysis"],
    updatedAt: "July 14, 2026",
    sections: [
      {
        heading: "The plane model",
        body: (
          <>
            <p>
              A complex number has a real part and an imaginary part, so it can be plotted as a point or vector in the plane.
            </p>
            <MathDisplay latex="z = a + bi \\quad \\leftrightarrow \\quad (a,b)" />
          </>
        ),
      },
      {
        heading: "Modulus and argument",
        body: (
          <>
            <p>
              The modulus is distance from the origin. The argument is angle from the positive real axis.
            </p>
            <MathDisplay latex="|z| = \\sqrt{a^2+b^2}, \\quad \\arg(z)=\\theta" />
            <p>
              This makes polar form natural.
            </p>
            <MathDisplay latex="z = r(\\cos \\theta + i\\sin \\theta)" />
          </>
        ),
      },
      {
        heading: "Multiplication rotates and scales",
        body: (
          <>
            <p>
              Multiplying complex numbers multiplies their lengths and adds their angles.
            </p>
            <MathDisplay latex="r_1 e^{i\\theta_1} \\cdot r_2 e^{i\\theta_2} = r_1r_2 e^{i(\\theta_1+\\theta_2)}" />
            <p>
              This is the reason $i$ behaves like a quarter-turn: multiplying by $i$ rotates by $90^\\circ$.
            </p>
          </>
        ),
      },
      {
        heading: "Roots become symmetry",
        body: (
          <>
            <p>
              The $n$th roots of a complex number sit evenly around a circle. Algebra becomes a regular polygon.
            </p>
            <MathDisplay latex="z_k = r^{1/n} e^{i(\\theta + 2\\pi k)/n}, \\quad k=0,1,\\dots,n-1" />
          </>
        ),
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
