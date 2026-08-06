"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SurfaceNav } from "@/components/navigation/surfaceNav";

type FeedTab = "activity" | "play" | "problems" | "guides";
type FeedKind = "play" | "problems" | "guides";

interface FeedItem {
  title: string;
  meta: string;
  action: "published" | "practiced" | "completed" | "reviewed" | "started" | "solved";
  kind: FeedKind;
  subtype: string;
  score?: string;
  href?: string;
}

const stats = [
  { label: "Sessions", value: "128", mark: "S", tone: "green" },
  { label: "Attempts", value: "4,920", mark: "A" },
  { label: "Accuracy", value: "91%", mark: "%", tone: "green" },
  { label: "Best Run", value: "742", mark: "#" },
  { label: "Guides", value: "3", mark: "G", tone: "green" },
];

const badges = [
  { label: "Founder", value: "SumTex", tone: "strong" },
  { label: "Developer", value: "Core", tone: "green" },
  { label: "Account age", value: "6 months" },
  { label: "Status", value: "Active" },
  { label: "Role", value: "Platform" },
];

const feedItems: FeedItem[] = [
  {
    title: "Completed a 5-star subtraction run",
    meta: "48/52 correct / mental arithmetic",
    action: "completed",
    kind: "play",
    subtype: "subtraction",
    score: "742",
    href: "/play/mental-arithmetic?category=subtraction&star=5",
  },
  {
    title: "Published A field guide to algebraic factoring",
    meta: "Guide / algebra / 9 min",
    action: "published",
    kind: "guides",
    subtype: "algebra",
    score: "new",
    href: "/paths/algebraic-factoring-field-guide",
  },
  {
    title: "Practiced big multiply in millions",
    meta: "31/34 correct / thousands to millions",
    action: "practiced",
    kind: "play",
    subtype: "big multiply",
    score: "611",
    href: "/play/mental-arithmetic?category=big-multiply&star=4",
  },
  {
    title: "Solved an intermediate algebra problem set",
    meta: "Problems / algebra / 12 solved",
    action: "solved",
    kind: "problems",
    subtype: "algebra",
    score: "12",
    href: "/problems",
  },
  {
    title: "Reviewed Limits without mysticism",
    meta: "Guide / calculus / epsilon delta",
    action: "reviewed",
    kind: "guides",
    subtype: "calculus",
    score: "updated",
    href: "/paths/limits-without-mysticism",
  },
  {
    title: "Practiced roots and powers",
    meta: "27/30 correct / squares and cubes",
    action: "practiced",
    kind: "play",
    subtype: "roots and powers",
    score: "488",
    href: "/play/mental-arithmetic?category=roots-powers&star=3",
  },
  {
    title: "Started Complex numbers as geometry",
    meta: "Guide / complex analysis / roots and rotations",
    action: "started",
    kind: "guides",
    subtype: "complex analysis",
    score: "8 min",
    href: "/paths/complex-numbers-as-geometry",
  },
  {
    title: "Solved a trigonometry warmup",
    meta: "Problems / trigonometry / identities",
    action: "solved",
    kind: "problems",
    subtype: "trigonometry",
    score: "6",
    href: "/problems",
  },
];

const attempts = [
  { expression: "874 - 392 = 482", result: "Correct", category: "subtraction" },
  { expression: "43 x 17 = 731", result: "Correct", category: "multiplication" },
  { expression: "sqrt(324) = 18", result: "Correct", category: "roots and powers" },
  { expression: "15% of 360 = 54", result: "Correct", category: "percents" },
];

const tabLabels: Record<FeedTab, string> = {
  activity: "Activity",
  play: "Play",
  problems: "Problems",
  guides: "Guides",
};

const tabFilters: Record<FeedTab, string[]> = {
  activity: ["all", "published", "practiced", "completed", "solved", "reviewed", "started"],
  play: ["all", "subtraction", "big multiply", "roots and powers", "percents"],
  problems: ["all", "algebra", "trigonometry", "geometry", "calculus"],
  guides: ["all", "algebra", "calculus", "complex analysis"],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<FeedTab>("activity");
  const [filter, setFilter] = useState("all");

  const shownItems = useMemo(() => {
    return feedItems.filter((item) => {
      const tabMatch = activeTab === "activity" || item.kind === activeTab;
      const filterMatch = filter === "all" || item.subtype === filter || item.action === filter;
      return tabMatch && filterMatch;
    });
  }, [activeTab, filter]);

  function setTab(tab: FeedTab) {
    setActiveTab(tab);
    setFilter("all");
  }

  return (
    <div className="act-shell">
      <style>{profileStyles}</style>
      <main className="act-main">
        <SurfaceNav variant="light" />

        <section className="act-profile">
          <div className="act-avatar">
            <img className="act-avatar-light" src="https://krisyotam.com/cdn/assets/logos/krisyotam-light.png" alt="Kris Yotam" />
            <img className="act-avatar-dark" src="https://krisyotam.com/cdn/assets/logos/krisyotam-dark.png" alt="Kris Yotam" />
          </div>
          <div className="act-identity">
            <div className="act-handle">@krisyotam</div>
            <h1>Kris Yotam</h1>
            <p className="act-bio">
              Building SumTex as a place for fast arithmetic practice, long-form mathematical guides, and eventually serious problem solving.
            </p>
            <p>Maintaining since 2026</p>
          </div>
        </section>

        <section className="act-badges" aria-label="Profile badges">
          {badges.map((badge) => (
            <div key={badge.label} className={`act-badge${badge.tone ? ` ${badge.tone}` : ""}`}>
              <span>{badge.label}</span>
              <strong>{badge.value}</strong>
            </div>
          ))}
        </section>

        <section className="act-stats" aria-label="Profile stats">
          {stats.map((stat) => (
            <Metric key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
          ))}
        </section>

        <section className="act-feed">
          <div className="act-feed-tabs">
            <div className="act-tab-group">
              {(Object.keys(tabLabels) as FeedTab[]).map((tab) => (
                <button
                  key={tab}
                  className={`act-tab${activeTab === tab ? " active" : ""}`}
                  type="button"
                  onClick={() => setTab(tab)}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>
            <div className="act-feed-actions">
              <label className="act-filter-label">
                <span>{activeTab === "activity" ? "Type" : "Subtype"}</span>
                <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                  {tabFilters[activeTab].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <Link className="act-tab" href="/profile/settings">Manage account</Link>
              <Link className="act-tab" href="/play/mental-arithmetic?category=subtraction&star=5">Play</Link>
            </div>
          </div>

          <div className="act-feed-list">
            {shownItems.map((item) => (
              <FeedRow key={`${item.action}-${item.title}`} item={item} />
            ))}
            {shownItems.length === 0 && (
              <div className="act-empty">No demo activity matches this filter.</div>
            )}
          </div>
        </section>

        <section className="act-feed act-attempts">
          <div className="act-feed-tabs">
            <div>
              <button className="act-tab active" type="button">Recent attempts</button>
            </div>
            <Link className="act-tab" href="/play">Modes</Link>
          </div>
          <div className="act-feed-list">
            {attempts.map((attempt) => (
              <div key={attempt.expression} className="act-feed-item">
                <div className="act-feed-row">
                  <div>
                    <span className="act-feed-title">{attempt.expression}</span>
                    <span className="act-feed-time">{attempt.category}</span>
                  </div>
                  <div className="act-feed-side">
                    <span className="act-pill green">{attempt.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const row = (
    <div className="act-feed-row">
      <div>
        <div className="act-kind-line">
          <span className={`act-action act-action-${item.action}`}>{item.action}</span>
          <span className="act-kind">{item.kind}</span>
          <span className="act-kind">{item.subtype}</span>
        </div>
        <span className="act-feed-title">{item.title}</span>
        <span className="act-feed-time">{item.meta}</span>
      </div>
      <div className="act-feed-side">
        {item.score && <span className="act-pill">{item.score}</span>}
      </div>
    </div>
  );

  return (
    <div className="act-feed-item">
      {item.href ? <Link href={item.href}>{row}</Link> : row}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  const stat = stats.find((item) => item.label === label);

  return (
    <div className="act-stat">
      <div className={`act-stat-badge${tone === "green" ? " green" : ""}`}>{stat?.mark ?? label.slice(0, 1)}</div>
      <div className={`act-stat-value${tone === "green" ? " green" : ""}`}>{value}</div>
      <div className="act-stat-label">{label}</div>
    </div>
  );
}

const profileStyles = `
  .act-shell {
    --surface-bg: #ffffff;
    --surface-card: #ffffff;
    --surface-text: #333;
    --surface-strong: #000;
    --surface-muted: #666;
    --surface-faint: #888;
    --surface-line: #e0e0e0;
    --surface-soft: #f4f4f4;
    min-height: 100vh;
    background: var(--surface-bg);
    color: var(--surface-text);
  }

  .dark .act-shell {
    --surface-bg: #0d0d0d;
    --surface-card: #111;
    --surface-text: #fff;
    --surface-strong: #fff;
    --surface-muted: #bdbdbd;
    --surface-faint: #888;
    --surface-line: #2a2a2a;
    --surface-soft: #1c1c1c;
  }

  .act-shell a { color: inherit; text-decoration: none; }
  .act-main { margin: 0 auto; max-width: 980px; padding: 28px 20px 72px; }
  .act-profile { align-items: center; display: flex; gap: 24px; justify-content: flex-start; margin: 10px 0 42px; text-align: left; width: 100%; }
  .act-avatar { align-items: center; background: var(--surface-card); border: 2px solid var(--surface-strong); border-radius: 50%; display: flex; flex-shrink: 0; height: 104px; justify-content: center; overflow: hidden; width: 104px; }
  .dark .act-avatar { border-color: #fff; }
  .act-avatar img { display: block; height: 100%; object-fit: cover; width: 100%; }
  .act-avatar-dark { display: none !important; }
  .dark .act-avatar-light { display: none !important; }
  .dark .act-avatar-dark { display: block !important; }
  .act-handle { color: var(--surface-faint); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.12em; margin-bottom: 6px; text-transform: uppercase; }
  .act-identity h1 { color: var(--surface-strong); font-size: 34px; font-weight: 600; letter-spacing: 0; line-height: 1.1; margin: 0 0 8px; }
  .act-identity p { color: var(--surface-muted); font-size: 14px; line-height: 1.45; margin: 0; max-width: 520px; }
  .act-identity .act-bio { margin-bottom: 8px; }
  .act-badges { display: flex; flex-wrap: wrap; gap: 10px; margin: -22px 0 28px; }
  .act-badge { align-items: center; background: var(--surface-card); border: 1px solid var(--surface-line); border-radius: 999px; display: inline-flex; gap: 9px; min-height: 34px; padding: 5px 12px; }
  .act-badge span { color: var(--surface-faint); font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; }
  .act-badge strong { color: var(--surface-strong); font-family: var(--font-mono); font-size: 12px; font-weight: 600; text-transform: uppercase; }
  .act-badge.strong { background: var(--surface-strong); border-color: var(--surface-strong); }
  .act-badge.strong span, .act-badge.strong strong { color: var(--surface-bg); }
  .act-badge.green { border-color: rgba(47, 111, 66, 0.35); }
  .act-badge.green strong { color: #2f6f42; }
  .act-stats { display: grid; gap: 16px; grid-template-columns: repeat(5, minmax(0, 1fr)); margin: 0 0 28px; }
  .act-stat { align-items: center; background: var(--surface-card); border: 1px solid var(--surface-line); border-radius: 12px; display: flex; flex-direction: column; padding: 15px 12px 13px; text-align: center; }
  .act-stat-badge { align-items: center; background: var(--surface-soft); border-radius: 999px; color: var(--surface-muted); display: flex; font-family: var(--font-mono); font-size: 13px; height: 30px; justify-content: center; margin-bottom: 12px; width: 30px; }
  .act-stat-badge.green { background: rgba(47, 111, 66, 0.12); color: #2f6f42; }
  .act-stat-value { color: var(--surface-strong); font-family: var(--font-mono); font-size: 24px; font-weight: 600; line-height: 1.1; }
  .act-stat-value.green { color: #2f6f42; }
  .act-stat-label { color: var(--surface-faint); font-size: 12px; line-height: 1.2; margin-top: 5px; }
  .act-feed { background: transparent; margin-top: 22px; }
  .act-feed-tabs { align-items: center; border-bottom: 1px solid var(--surface-line); display: flex; gap: 18px; justify-content: space-between; padding: 10px; }
  .act-tab-group, .act-feed-actions { align-items: center; display: flex; flex-wrap: wrap; gap: 4px; }
  .act-feed-actions { justify-content: flex-end; }
  .act-tab { background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--surface-muted); cursor: pointer; display: inline-flex; font-size: 13px; line-height: 1; margin-bottom: -11px; padding: 8px 10px 18px; text-decoration: none; }
  .act-tab.active { border-bottom-color: var(--surface-strong); color: var(--surface-strong); }
  .act-filter-label { align-items: center; color: var(--surface-faint); display: inline-flex; font-family: var(--font-mono); font-size: 11px; gap: 8px; letter-spacing: 0.08em; margin-right: 4px; text-transform: uppercase; }
  .act-filter-label select { appearance: none; background: var(--surface-card); border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-strong); cursor: pointer; font-family: var(--font-mono); font-size: 12px; height: 32px; line-height: 1; padding: 0 28px 0 12px; text-transform: lowercase; }
  .act-feed-list { display: flex; flex-direction: column; gap: 10px; padding-top: 18px; }
  .act-feed-item { background: var(--surface-card); border: 1px solid var(--surface-line); border-radius: 12px; overflow: hidden; }
  .act-feed-row { align-items: center; background: transparent; border: 0; color: var(--surface-text); display: grid; gap: 16px; grid-template-columns: 1fr auto; padding: 16px 18px; text-align: left; width: 100%; }
  .act-kind-line { align-items: center; display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 8px; }
  .act-action, .act-kind { border-radius: 999px; display: inline-flex; font-family: var(--font-mono); font-size: 11px; line-height: 1; padding: 4px 8px; text-transform: lowercase; }
  .act-action { background: #101010; border: 1px solid #101010; color: #fff; }
  .dark .act-action { background: #fff; border-color: #fff; color: #000; }
  .act-action-published { background: #2f6f42; border-color: #2f6f42; color: #fff; }
  .act-action-practiced, .act-action-completed, .act-action-solved { background: var(--surface-soft); border: 1px solid var(--surface-line); color: var(--surface-strong); }
  .act-kind { background: transparent; border: 1px solid var(--surface-line); color: var(--surface-faint); }
  .act-feed-title { color: var(--surface-strong); display: block; font-size: 15px; font-weight: 500; }
  .act-feed-time, .act-pill { color: var(--surface-faint); font-size: 12px; }
  .act-feed-side { align-items: center; display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
  .act-pill { background: var(--surface-soft); border: 1px solid var(--surface-line); border-radius: 999px; font-family: var(--font-mono); padding: 4px 9px; text-transform: lowercase; }
  .act-pill.green { color: #2f6f42; }
  .act-empty { border: 1px solid var(--surface-line); border-radius: 12px; color: var(--surface-muted); font-size: 14px; padding: 24px; text-align: center; }
  @media (max-width: 900px) {
    .act-profile { align-items: center; flex-direction: column; text-align: center; }
    .act-badges { justify-content: center; margin-top: -20px; }
    .act-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .act-feed-tabs { align-items: flex-start; flex-direction: column; gap: 8px; }
    .act-feed-actions { justify-content: flex-start; }
    .act-feed-row { grid-template-columns: 1fr; }
    .act-feed-side { justify-content: flex-start; }
  }
`;
