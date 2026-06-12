import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/lib/theme";
import { MathJaxProvider } from "@/components/math/mathJaxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SumTeX",
  description:
    "HackTheBox for mathematics. Problems from real textbooks, solved in LaTeX.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ThemeProvider>
          <MathJaxProvider>{children}</MathJaxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
