// Math practice problems for the math game

let problems = [
	{
		"title": "Basic Quadratic Equation",
		"description": "Solve for x when the quadratic equals zero.",
		"latex": String.raw`x^2 - 5x + 6 = 0`,
		"solution": String.raw`x = 2 \text{ or } x = 3`,
		"hint": String.raw`Try factoring: (x - 2)(x - 3) = 0`
	},
	{
		"title": "Pythagorean Theorem Application",
		"description": "Find the length of the hypotenuse.",
		"latex": String.raw`\text{Given: } a = 3, b = 4. \text{ Find } c.`,
		"solution": String.raw`c = 5`,
		"hint": String.raw`Use c^2 = a^2 + b^2`
	},
	{
		"title": "Simple Derivative",
		"description": "Find the derivative of the function.",
		"latex": String.raw`\frac{d}{dx}(x^3 + 2x^2 - x + 5)`,
		"solution": String.raw`3x^2 + 4x - 1`,
		"hint": String.raw`Use the power rule: \frac{d}{dx}(x^n) = nx^{n-1}`
	},
	{
		"title": "System of Linear Equations",
		"description": "Solve for x and y.",
		"latex": String.raw`\begin{cases} 2x + y = 7 \\ x - y = 2 \end{cases}`,
		"solution": String.raw`x = 3, y = 1`,
		"hint": String.raw`Try adding the equations to eliminate y`
	},
	{
		"title": "Logarithm Simplification",
		"description": "Simplify the logarithmic expression.",
		"latex": String.raw`\log_2(8) + \log_2(4)`,
		"solution": String.raw`5`,
		"hint": String.raw`Remember: \log_a(x) + \log_a(y) = \log_a(xy)`
	}
];
