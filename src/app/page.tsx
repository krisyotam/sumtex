import { Header } from "@/components/navigation/header";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-canvas)" }}
    >
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <h1
            className="text-4xl font-semibold tracking-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            SumTeX
          </h1>
          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Mathematics is learned through textbooks and repetition, not videos.
            Real problems from Rudin, Spivak, Artin, Munkres, and more. Solve
            them. Track your progress. Get better.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/play"
              className="px-5 py-2.5 text-sm font-medium rounded no-underline transition-colors"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
              }}
            >
              Start solving
            </a>
            <a
              href="/problems"
              className="px-5 py-2.5 text-sm font-medium rounded no-underline transition-colors"
              style={{
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              Browse problems
            </a>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl w-full"
          style={{ color: "var(--text-secondary)" }}
        >
          <div className="text-center">
            <div
              className="text-2xl font-semibold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Textbooks
            </div>
            <p className="text-sm">
              Problems pulled from qualified mathematical texts. Spivak,
              Rudin, Artin, Munkres.
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-semibold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Paths
            </div>
            <p className="text-sm">
              Work through a textbook end to end. Track your progress across
              chapters.
            </p>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-semibold mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Community
            </div>
            <p className="text-sm">
              Submit problems, discuss solutions, build your profile. Open
              source questions.
            </p>
          </div>
        </div>
      </main>
      <footer
        className="py-4 text-center text-xs border-t"
        style={{
          color: "var(--text-muted)",
          borderColor: "var(--border-color)",
          background: "var(--bg-primary)",
        }}
      >
        SumTeX by Kris Yotam
      </footer>
    </div>
  );
}
