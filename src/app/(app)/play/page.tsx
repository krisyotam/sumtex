import { SurfaceNav } from "@/components/navigation/surfaceNav";
import { arithmeticCategories } from "@/lib/arithmetic";

const arithmeticModes = arithmeticCategories.map((category) => ({
  title: category.label,
  status: "Live",
  href: `/play/mental-arithmetic?category=${category.id}&star=2`,
  description: category.description,
  detail: category.id === "roots-powers" ? "sqrt n / n^2 / n^3" : "1 to 5 stars",
}));

export default function PlayPage() {
  return (
    <>
      <style>{playHubStyles}</style>
      <div className="play-shell">
        <div className="play-frame">
          <SurfaceNav variant="dark" />

          <header className="play-hero">
            <div>
              <p className="play-kicker">SumTex Play</p>
              <h1>Modes of Arithmetic</h1>
              <p>
                Choose the drill type first. Stars, timing, custom settings, and keypad entry stay inside the run page.
              </p>
            </div>
            <a className="play-cta" href="/play/mental-arithmetic?category=addition&star=2">
              Start addition
            </a>
          </header>

          <section className="play-grid" aria-label="Arithmetic modes">
            {arithmeticModes.map((mode, index) => (
              <a key={mode.title} className="play-mode live" href={mode.href}>
                <div className="play-mode-index">{String(index + 1).padStart(2, "0")}</div>
                <div className="play-mode-body">
                  <div className="play-mode-top">
                    <h2>{mode.title}</h2>
                    <span className="play-status live">{mode.status}</span>
                  </div>
                  <p>{mode.description}</p>
                  <div className="play-mode-detail">{mode.detail}</div>
                </div>
              </a>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}

const playHubStyles = `
  .play-shell {
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

  .dark .play-shell {
    --surface-bg: #080808;
    --surface-bg-soft: #0d0d0d;
    --surface-text: #f4f2ee;
    --surface-strong: #f5f3ef;
    --surface-muted: #8d8d8d;
    --surface-faint: #777;
    --surface-line: #242424;
    --surface-pill: #151515;
  }

  .play-shell a { color: inherit; text-decoration: none; }
  .play-frame { margin: 0 auto; max-width: 1440px; }
  .play-hero { align-items: flex-start; display: flex; gap: 32px; justify-content: space-between; margin: 0 0 62px; }
  .play-kicker { color: var(--surface-faint); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.18em; line-height: 1; margin: 0 0 22px; text-transform: uppercase; }
  .play-hero h1 { color: var(--surface-strong); font-size: clamp(52px, 7vw, 108px); font-weight: 400; letter-spacing: 0; line-height: 0.95; margin: 0; }
  .play-hero p { color: var(--surface-muted); font-size: 18px; line-height: 1.5; margin: 24px 0 0; max-width: 680px; }
  .play-cta { align-items: center; background: transparent; border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-strong); display: inline-flex; font-family: var(--font-mono); font-size: 13px; font-weight: 600; justify-content: center; letter-spacing: 0.14em; min-height: 54px; padding: 0 28px; text-transform: uppercase; white-space: nowrap; }
  .play-cta:hover { background: var(--surface-pill); border-color: var(--surface-muted); }
  .play-grid { border-top: 1px solid var(--surface-line); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .play-mode { border-bottom: 1px solid var(--surface-line); color: var(--surface-text); display: grid; gap: 28px; grid-template-columns: 56px 1fr; min-height: 220px; padding: 34px 34px 32px 0; position: relative; }
  .play-mode:nth-child(odd) { border-right: 1px solid var(--surface-line); padding-right: 44px; }
  .play-mode:nth-child(even) { padding-left: 44px; }
  .play-mode.live:hover { background: var(--surface-bg-soft); }
  .play-mode-index { color: var(--surface-faint); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.14em; padding-top: 5px; }
  .play-mode-top { align-items: center; display: flex; gap: 18px; justify-content: space-between; }
  .play-mode h2 { color: var(--surface-strong); font-size: clamp(28px, 3vw, 46px); font-weight: 400; letter-spacing: 0; line-height: 1.08; margin: 0; }
  .play-mode p { color: var(--surface-muted); font-size: 17px; line-height: 1.5; margin: 30px 0 0; max-width: 540px; }
  .play-mode-detail { color: var(--surface-faint); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; margin-top: 32px; text-transform: uppercase; }
  .play-status { border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-faint); flex: 0 0 auto; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; padding: 7px 10px; text-transform: uppercase; }
  .play-status.live { border-color: var(--surface-strong); color: var(--surface-strong); }

  @media (max-width: 900px) {
    .play-shell { padding: 28px 20px 56px; }
    .play-hero { align-items: stretch; flex-direction: column; margin-bottom: 40px; }
    .play-grid { grid-template-columns: 1fr; }
    .play-mode, .play-mode:nth-child(even), .play-mode:nth-child(odd) { border-right: 0; grid-template-columns: 42px 1fr; min-height: 190px; padding: 28px 0; }
  }
`;
