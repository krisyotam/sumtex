import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SumTeX - A LaTeX Math Game",
  description: "An advanced mathematics platform that uses problems from past and contemporary textbooks",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
