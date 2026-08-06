"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/navigation/themeToggle";

const navLinks = [
  { href: "/play", label: "Play" },
  { href: "/problems", label: "Problems" },
  { href: "/paths", label: "Guides" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/collections", label: "Collections" },
  { href: "/forum", label: "Forum" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
];

export function SurfaceNav({
  variant = "dark",
  labels = "full",
}: {
  variant?: "dark" | "light";
  labels?: "full" | "compact";
}) {
  return (
    <nav className={`surface-nav surface-nav-${variant}`} aria-label="Primary">
      <a className="surface-brand" href="/">
        SumTex
      </a>
      <div className="surface-nav-links">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {labels === "compact" && link.label === "Play" ? "Modes" : link.label}
          </a>
        ))}
        <ThemeToggle className="surface-theme-toggle" />
        <Show
          when="signed-in"
          fallback={
            <SignInButton mode="modal">
              <button type="button" className="surface-auth-button">
                Sign in
              </button>
            </SignInButton>
          }
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: "surface-user-avatar",
                userButtonPopoverCard: "surface-user-popover",
              },
            }}
            userProfileUrl="/profile/settings"
          />
        </Show>
      </div>
    </nav>
  );
}
