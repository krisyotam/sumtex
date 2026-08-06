import { SurfaceNav } from "@/components/navigation/surfaceNav";

const modes = [
  {
    title: "Algebra",
    status: "Planned",
    description: "Pre-algebra, intermediate algebra, and advanced algebra in one progression.",
    detail: "Pre / Intermediate / Advanced",
  },
  {
    title: "Trigonometry",
    status: "Planned",
    description: "Angles, identities, equations, graphs, and applied triangle work.",
    detail: "Identities / Graphs / Applications",
  },
  {
    title: "Geometry",
    status: "Planned",
    description: "Synthetic, analytic, and proof-oriented geometry problem sets.",
    detail: "Euclidean / Coordinate / Proofs",
  },
  {
    title: "Calculus",
    status: "Planned",
    description: "Calculus 1, 2, and 3 tracks for limits, integrals, series, and multivariable work.",
    detail: "I / II / III",
  },
  {
    title: "Real Analysis",
    status: "Planned",
    description: "Sequences, topology of the line, continuity, differentiation, integration, and metric spaces.",
    detail: "Proof-heavy",
  },
  {
    title: "Complex Analysis",
    status: "Planned",
    description: "Holomorphic functions, residues, contour integration, and conformal maps.",
    detail: "Functions / Integrals / Residues",
  },
  {
    title: "Function Analysis",
    status: "Planned",
    description: "Function spaces, operators, norms, convergence, and structural problem drills.",
    detail: "Spaces / Operators / Norms",
  },
];

export default function ProblemsPage() {
  return (
    <>
      <style>{problemHubStyles}</style>
      <div className="problem-shell">
        <div className="problem-frame">
          <SurfaceNav variant="dark" />

          <header className="problem-hero">
            <div>
              <p className="problem-kicker">SumTex Problems</p>
              <h1>Choose a subject</h1>
              <p>
                Problem tracks begin here. Arithmetic lives under Play; broader math problem sets start with Algebra.
              </p>
            </div>
          </header>

          <section className="problem-grid" aria-label="Problem subjects">
            {modes.map((mode, index) => (
              <div key={mode.title} className="problem-mode disabled" aria-disabled="true">
                <div className="problem-mode-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="problem-mode-body">
                  <div className="problem-mode-top">
                    <h2>{mode.title}</h2>
                    <span className="problem-status">{mode.status}</span>
                  </div>
                  <p>{mode.description}</p>
                  <div className="problem-mode-detail">{mode.detail}</div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

const problemHubStyles = `
  .problem-shell {
    --surface-bg: #ffffff;
    --surface-bg-soft: #f6f6f6;
    --surface-text: #171717;
    --surface-strong: #000000;
    --surface-muted: #555555;
    --surface-faint: #8a8a8a;
    --surface-line: #dedede;
    --surface-pill: #f7f7f7;
    min-height: 100vh;
    background: var(--surface-bg);
    color: var(--surface-text);
    padding: 28px 5vw 70px;
  }

  .dark .problem-shell {
    --surface-bg: #080808;
    --surface-bg-soft: #0d0d0d;
    --surface-text: #f4f2ee;
    --surface-strong: #f5f3ef;
    --surface-muted: #8d8d8d;
    --surface-faint: #777;
    --surface-line: #242424;
    --surface-pill: #151515;
  }

  .problem-shell a { color: inherit; text-decoration: none; }
  .problem-frame { margin: 0 auto; max-width: 1440px; }
  .problem-hero { align-items: flex-start; display: flex; gap: 32px; justify-content: space-between; margin: 0 0 62px; }
  .problem-kicker { color: var(--surface-faint); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.18em; line-height: 1; margin: 0 0 22px; text-transform: uppercase; }
  .problem-hero h1 { color: var(--surface-strong); font-size: clamp(52px, 7vw, 108px); font-weight: 400; letter-spacing: 0; line-height: 0.95; margin: 0; }
  .problem-hero p { color: var(--surface-muted); font-size: 18px; line-height: 1.5; margin: 24px 0 0; max-width: 680px; }
  .problem-grid { border-top: 1px solid var(--surface-line); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .problem-mode { border-bottom: 1px solid var(--surface-line); color: var(--surface-text); display: grid; gap: 28px; grid-template-columns: 56px 1fr; min-height: 220px; padding: 34px 34px 32px 0; position: relative; }
  .problem-mode:nth-child(odd) { border-right: 1px solid var(--surface-line); padding-right: 44px; }
  .problem-mode:nth-child(even) { padding-left: 44px; }
  .problem-mode.disabled { cursor: default; }
  .problem-mode-index { color: var(--surface-faint); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.14em; padding-top: 5px; }
  .problem-mode-top { align-items: center; display: flex; gap: 18px; justify-content: space-between; }
  .problem-mode h2 { color: var(--surface-strong); font-size: clamp(28px, 3vw, 46px); font-weight: 400; letter-spacing: 0; line-height: 1.08; margin: 0; }
  .problem-mode p { color: var(--surface-muted); font-size: 17px; line-height: 1.5; margin: 30px 0 0; max-width: 540px; }
  .problem-mode-detail { color: var(--surface-faint); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; margin-top: 32px; text-transform: uppercase; }
  .problem-status { border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-faint); flex: 0 0 auto; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; padding: 7px 10px; text-transform: uppercase; }
  .problem-mode-body { opacity: 0.72; }

  @media (max-width: 900px) {
    .problem-shell { padding: 28px 20px 56px; }
    .problem-hero { align-items: stretch; flex-direction: column; margin-bottom: 40px; }
    .problem-grid { grid-template-columns: 1fr; }
    .problem-mode, .problem-mode:nth-child(even), .problem-mode:nth-child(odd) { border-right: 0; grid-template-columns: 42px 1fr; min-height: 190px; padding: 28px 0; }
  }
`;
