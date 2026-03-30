import { Problem } from "./types";

export const demoProblems: Problem[] = [
  {
    "title": "Basic Quadratic Equation",
    "description": "Solve for x when the quadratic equals zero.",
    "latex": "x^2 - 5x + 6 = 0",
    "solution": "x = 2 \\text{ or } x = 3",
    "hint": "Try factoring: (x - 2)(x - 3) = 0"
  },
  {
    "title": "Pythagorean Theorem Application",
    "description": "Find the length of the hypotenuse.",
    "latex": "\\text{Given: } a = 3, b = 4. \\text{ Find } c.",
    "solution": "c = 5",
    "hint": "Use c^2 = a^2 + b^2"
  },
  {
    "title": "Simple Derivative",
    "description": "Find the derivative of the function.",
    "latex": "\\frac{d}{dx}(x^3 + 2x^2 - x + 5)",
    "solution": "3x^2 + 4x - 1",
    "hint": "Use the power rule: \\frac{d}{dx}(x^n) = nx^{n-1}"
  },
  {
    "title": "System of Linear Equations",
    "description": "Solve for x and y.",
    "latex": "\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}",
    "solution": "x = 3, y = 1",
    "hint": "Try adding the equations to eliminate y"
  },
  {
    "title": "Logarithm Simplification",
    "description": "Simplify the logarithmic expression.",
    "latex": "\\log_2(8) + \\log_2(4)",
    "solution": "5",
    "hint": "Remember: \\log_a(x) + \\log_a(y) = \\log_a(xy)"
  }
];
