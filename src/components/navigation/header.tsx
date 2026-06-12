"use client";

import { useTheme } from "@/lib/theme";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header
      className="flex items-center justify-between px-6 border-b"
      style={{
        height: "var(--topbar-height)",
        background: "var(--bg-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-baseline gap-5">
        <a
          href="/"
          className="text-sm font-semibold no-underline"
          style={{ color: "var(--text-primary)" }}
        >
          SumTeX
        </a>
        <nav className="flex items-center gap-4">
          <a
            href="/play"
            className="text-[13px] no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Play
          </a>
          <a
            href="/problems"
            className="text-[13px] no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Problems
          </a>
          <a
            href="/paths"
            className="text-[13px] no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Paths
          </a>
          <a
            href="/roadmaps"
            className="text-[13px] no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Roadmaps
          </a>
          <a
            href="/forum"
            className="text-[13px] no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Forum
          </a>
          <a
            href="/leaderboard"
            className="text-[13px] no-underline transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Leaderboard
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded transition-colors cursor-pointer border-none"
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
          }}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
        <a
          href="/sign-in"
          className="text-[13px] px-3 py-1.5 rounded no-underline transition-colors"
          style={{
            background: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          Sign in
        </a>
      </div>
    </header>
  );
}
