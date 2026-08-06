import { notFound } from "next/navigation";
import { SurfaceNav } from "@/components/navigation/surfaceNav";
import { getGuide, guides } from "@/lib/guides";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <>
      <style>{guidePageStyles}</style>
      <main className="guide-doc-shell">
        <div className="guide-doc-frame">
          <SurfaceNav variant="light" />

          <article className="guide-doc-card">
            <span className="guide-doc-dot" />
            <header className="guide-doc-header">
              <div className="guide-doc-meta">
                <span>{guide.source}</span>
                <span>{guide.readTime}</span>
                <span>{guide.updatedAt}</span>
              </div>
              <h1>{guide.title}</h1>
              <p>{guide.dek}</p>
              <div className="guide-doc-author">Created by {guide.author}</div>
            </header>

            <div className="guide-doc-body">
              {guide.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.body}
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
    </>
  );
}

const guidePageStyles = `
  .guide-doc-shell {
    --surface-bg: #ffffff;
    --surface-card: #ffffff;
    --surface-text: #303030;
    --surface-strong: #111;
    --surface-muted: #555;
    --surface-faint: #9a9a9a;
    --surface-line: #e3e3e3;
    min-height: 100vh;
    background: var(--surface-bg);
    color: var(--surface-text);
    padding: 28px 5vw 86px;
  }

  .dark .guide-doc-shell {
    --surface-bg: #080808;
    --surface-card: #111;
    --surface-text: #d6d3cc;
    --surface-strong: #fff;
    --surface-muted: #aaa;
    --surface-faint: #707070;
    --surface-line: #242424;
  }

  .guide-doc-shell a { color: inherit; text-decoration: none; }
  .guide-doc-frame { margin: 0 auto; max-width: 1180px; }
  .guide-doc-card { background: var(--surface-card); border: 1px solid var(--surface-line); border-radius: 8px; box-shadow: 0 24px 58px rgba(0,0,0,0.09); margin: 52px auto 0; max-width: 760px; min-height: 860px; padding: clamp(34px, 6vw, 64px); position: relative; }
  .dark .guide-doc-card { box-shadow: none; }
  .guide-doc-dot { background: #aeb4bf; border-radius: 50%; height: 9px; position: absolute; right: 16px; top: 16px; width: 9px; }
  .guide-doc-meta { color: var(--surface-faint); display: flex; flex-wrap: wrap; gap: 14px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; margin-bottom: 28px; text-transform: uppercase; }
  .guide-doc-header h1 { color: var(--surface-strong); font-size: clamp(42px, 7vw, 68px); font-weight: 650; letter-spacing: 0; line-height: 0.98; margin: 0; }
  .guide-doc-header p { color: var(--surface-muted); font-size: 18px; line-height: 1.55; margin: 22px 0 0; }
  .guide-doc-author { color: var(--surface-faint); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; margin-top: 24px; text-transform: uppercase; }
  .guide-doc-body { margin-top: 56px; }
  .guide-doc-body section { border-top: 1px solid var(--surface-line); padding: 30px 0 4px; }
  .guide-doc-body h2 { color: var(--surface-strong); font-size: 28px; font-weight: 650; letter-spacing: 0; line-height: 1.12; margin: 0 0 14px; }
  .guide-doc-body p { color: var(--surface-text); font-size: 16px; line-height: 1.72; margin: 0 0 16px; }
  .guide-doc-body ul { color: var(--surface-text); margin: 0 0 16px; padding-left: 20px; }
  .guide-doc-body li { margin: 6px 0; }
  .guide-doc-body mjx-container[jax="CHTML"][display="true"] { margin: 26px 0; overflow-x: auto; overflow-y: hidden; padding: 10px 0; }
  @media (max-width: 720px) {
    .guide-doc-shell { padding: 28px 16px 56px; }
    .guide-doc-card { margin-top: 34px; padding: 34px 24px; }
    .guide-doc-meta { gap: 10px; }
  }
`;
