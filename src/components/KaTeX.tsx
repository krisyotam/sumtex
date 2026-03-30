"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

interface KaTeXProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export default function KaTeX({ math, displayMode = false, className }: KaTeXProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && math) {
      try {
        katex.render(math, ref.current, {
          throwOnError: false,
          displayMode,
        });
      } catch {
        if (ref.current) ref.current.textContent = math;
      }
    }
  }, [math, displayMode]);

  return <span ref={ref} className={className} />;
}
