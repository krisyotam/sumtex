"use client";

import { MathJaxContext } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/ams", "[tex]/noerrors", "[tex]/noundefined"] },
  tex: {
    packages: { "[+]": ["ams", "noerrors", "noundefined"] },
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
  },
};

export function MathJaxProvider({ children }: { children: React.ReactNode }) {
  return (
    <MathJaxContext version={3} config={config}>
      {children}
    </MathJaxContext>
  );
}
