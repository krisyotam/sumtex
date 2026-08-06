import { SurfaceNav } from "@/components/navigation/surfaceNav";
import { guides } from "@/lib/guides";

export default function GuidesPage() {
  return (
    <>
      <style>{guideIndexStyles}</style>
      <main className="guides-shell">
        <div className="guides-frame">
          <SurfaceNav variant="light" />

          <header className="guides-hero">
            <p>SumTex Guides</p>
            <h1>Guides</h1>
            <div>
              Platform and user-authored documents for algebra, calculus, analysis, and proof technique.
            </div>
          </header>

          <section className="guide-board" aria-label="Guide documents">
            {guides.map((guide, index) => (
              <a key={guide.slug} href={`/paths/${guide.slug}`} className="guide-card">
                <span className={`guide-dot guide-dot-${index % 3}`} />
                <div className="guide-card-meta">
                  <span>{guide.source}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h2>{guide.title}</h2>
                <p>{guide.dek}</p>
                <div className="guide-card-footer">
                  <span>Created by {guide.author}</span>
                  <span>{guide.level}</span>
                </div>
              </a>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

const guideIndexStyles = `
  .guides-shell {
    --surface-bg: #ffffff;
    --surface-bg-soft: #f7f7f7;
    --surface-card: #ffffff;
    --surface-text: #171717;
    --surface-strong: #000;
    --surface-muted: #555;
    --surface-faint: #9a9a9a;
    --surface-line: #e3e3e3;
    min-height: 100vh;
    background: var(--surface-bg);
    color: var(--surface-text);
    padding: 28px 5vw 76px;
  }

  .dark .guides-shell {
    --surface-bg: #080808;
    --surface-bg-soft: #101010;
    --surface-card: #111;
    --surface-text: #f4f2ee;
    --surface-strong: #fff;
    --surface-muted: #a0a0a0;
    --surface-faint: #6d6d6d;
    --surface-line: #242424;
  }

  .guides-shell a { color: inherit; text-decoration: none; }
  .guides-frame { margin: 0 auto; max-width: 1440px; }
  .guides-hero { margin: 52px 0 58px; max-width: 820px; }
  .guides-hero p { color: var(--surface-faint); font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.18em; margin: 0 0 22px; text-transform: uppercase; }
  .guides-hero h1 { color: var(--surface-strong); font-size: clamp(52px, 7vw, 104px); font-weight: 400; letter-spacing: 0; line-height: 0.96; margin: 0; }
  .guides-hero div { color: var(--surface-muted); font-size: 18px; line-height: 1.55; margin-top: 24px; max-width: 660px; }
  .guide-board { align-items: start; display: grid; gap: 24px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .guide-card { background: var(--surface-card); border: 1px solid var(--surface-line); border-radius: 8px; box-shadow: 0 18px 42px rgba(0,0,0,0.08); display: flex; flex-direction: column; min-height: 520px; padding: 34px 28px 26px; position: relative; transition: border-color 160ms ease, transform 160ms ease; }
  .dark .guide-card { box-shadow: none; }
  .guide-card:hover { border-color: var(--surface-muted); transform: translateY(-2px); }
  .guide-dot { border-radius: 50%; height: 9px; position: absolute; right: 14px; top: 14px; width: 9px; }
  .guide-dot-0 { background: #6fd88c; }
  .guide-dot-1 { background: #aeb4bf; }
  .guide-dot-2 { background: #111; }
  .dark .guide-dot-2 { background: #f4f2ee; }
  .guide-card-meta, .guide-card-footer { color: var(--surface-faint); display: flex; font-family: var(--font-mono); font-size: 12px; justify-content: space-between; letter-spacing: 0.08em; text-transform: uppercase; }
  .guide-card h2 { color: var(--surface-strong); font-size: clamp(28px, 3vw, 42px); font-weight: 600; letter-spacing: 0; line-height: 1.05; margin: 44px 0 18px; }
  .guide-card p { color: var(--surface-muted); font-size: 15px; line-height: 1.55; margin: 0; }
  .guide-card-footer { margin-top: auto; padding-top: 34px; }
  @media (max-width: 1100px) { .guide-board { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 720px) {
    .guides-shell { padding: 28px 20px 56px; }
    .guide-board { grid-template-columns: 1fr; }
    .guide-card { min-height: 430px; }
  }
`;
