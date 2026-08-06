"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SurfaceNav } from "@/components/navigation/surfaceNav";
import {
  arithmeticCategories,
  checkArithmeticAnswer,
  createSeededRng,
  defaultCustomConfig,
  generateArithmeticProblem,
  scoreArithmeticAttempt,
  type ArithmeticCategory,
  type ArithmeticCustomConfig,
  type ArithmeticProblem,
  type ArithmeticRunMode,
  type ArithmeticSessionConfig,
  type ArithmeticStar,
  type ArithmeticSubmode,
  type BigMagnitude,
} from "@/lib/arithmetic";

type AttemptRow = {
  expression: string;
  answer: string;
  userAnswer: string;
  correct: boolean;
};

const runModes: Array<{ id: ArithmeticRunMode; label: string }> = [
  { id: "untimed", label: "Practice" },
  { id: "30s", label: "30s" },
  { id: "60s", label: "60s" },
  { id: "120s", label: "120s" },
  { id: "300s", label: "300s" },
];

const submodes: Array<{ id: ArithmeticSubmode; label: string }> = [
  { id: "sqrt", label: "sqrt n" },
  { id: "square", label: "n^2" },
  { id: "cube", label: "n^3" },
];

const magnitudes: Array<{ id: BigMagnitude; label: string }> = [
  { id: "thousands", label: "Thousands" },
  { id: "millions", label: "Millions" },
  { id: "billions", label: "Billions" },
];

export function MentalArithmeticPlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<ArithmeticCategory>(() => parseCategory(searchParams.get("category")));
  const [star, setStar] = useState<ArithmeticStar>(() => parseStar(searchParams.get("star")));
  const [runMode, setRunMode] = useState<ArithmeticRunMode>("60s");
  const [submode, setSubmode] = useState<ArithmeticSubmode>("square");
  const [magnitude, setMagnitude] = useState<BigMagnitude>("thousands");
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customConfig, setCustomConfig] = useState<ArithmeticCustomConfig>(defaultCustomConfig);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [seed, setSeed] = useState(1);
  const [problem, setProblem] = useState<ArithmeticProblem | null>(null);
  const [answer, setAnswer] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [problemStartedAt, setProblemStartedAt] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(60);
  const [running, setRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [recent, setRecent] = useState<AttemptRow[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const rngRef = useRef(createSeededRng(1));
  const inputRef = useRef<HTMLInputElement>(null);

  const config = useMemo<ArithmeticSessionConfig>(
    () => ({
      mode: customEnabled ? "custom" : "standard",
      category,
      submode: category === "roots-powers" ? submode : undefined,
      star,
      runMode,
      magnitude: category.startsWith("big-") ? magnitude : undefined,
      customConfig: customEnabled ? customConfig : undefined,
    }),
    [category, customConfig, customEnabled, magnitude, runMode, star, submode]
  );

  const duration = runMode === "untimed" ? null : Number(runMode.replace("s", ""));
  const binaryKeypad = problem?.answerFormat === "binary";
  const selectedCategory = arithmeticCategories.find((item) => item.id === category);
  const pageTitle = customEnabled
    ? `Custom arithmetic · ${star} ${star === 1 ? "star" : "stars"}`
    : `${selectedCategory?.label ?? "Arithmetic"} · ${star} ${star === 1 ? "star" : "stars"}`;

  const nextProblem = useCallback(() => {
    const generated = generateArithmeticProblem(config, rngRef.current);
    setProblem(generated);
    setProblemStartedAt(Date.now());
    setAnswer("");
    setFeedback(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [config]);

  const start = useCallback(async () => {
    const nextSeed = Math.floor(Math.random() * 2_147_483_647);
    rngRef.current = createSeededRng(nextSeed);
    setSeed(nextSeed);
    setScore(0);
    setTotal(0);
    setCorrect(0);
    setRecent([]);
    setStartedAt(Date.now());
    setTimeLeft(duration);
    setRunning(true);
    setEnded(false);
    setSessionId(null);

    const generated = generateArithmeticProblem(config, rngRef.current);
    setProblem(generated);
    setProblemStartedAt(Date.now());
    setAnswer("");

    const response = await fetch("/api/arithmetic/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ config, seed: nextSeed }),
    });
    const data = (await response.json()) as { sessionId?: string | null };
    setSessionId(data.sessionId ?? null);

    requestAnimationFrame(() => inputRef.current?.focus());
  }, [config, duration]);

  const end = useCallback(
    async (override?: { score: number; total: number; correct: number; sessionId: string | null }) => {
      setRunning(false);
      setEnded(true);
      setProblem(null);

      const payload = {
        sessionId: override?.sessionId ?? sessionId,
        score: override?.score ?? score,
        totalAttempts: override?.total ?? total,
        correctAttempts: override?.correct ?? correct,
      };

      if (payload.sessionId) {
        await fetch("/api/arithmetic/end", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    },
    [correct, score, sessionId, total]
  );

  const submit = useCallback(async () => {
    if (!problem || !running || !problemStartedAt || !answer.trim()) {
      return;
    }

    const elapsedMs = Date.now() - problemStartedAt;
    const isCorrect = checkArithmeticAnswer(problem, answer);
    const scoreDelta = scoreArithmeticAttempt(
      { correct: isCorrect, elapsedMs, problem },
      config
    );
    const nextScore = score + scoreDelta;
    const nextTotal = total + 1;
    const nextCorrect = correct + (isCorrect ? 1 : 0);

    setScore(nextScore);
    setTotal(nextTotal);
    setCorrect(nextCorrect);
    setFeedback(isCorrect ? "correct" : "wrong");
    setRecent((items) =>
      [
        {
          expression: problem.expression,
          answer: problem.canonicalAnswer,
          userAnswer: answer,
          correct: isCorrect,
        },
        ...items,
      ].slice(0, 8)
    );

    if (sessionId) {
      void fetch("/api/arithmetic/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId,
          problem,
          userAnswer: answer,
          correct: isCorrect,
          elapsedMs,
          scoreDelta,
        }),
      });
    }

    nextProblem();
  }, [answer, config, correct, nextProblem, problem, problemStartedAt, running, score, sessionId, total]);

  useEffect(() => {
    if (!running || duration === null || startedAt === null) {
      return;
    }

    const interval = window.setInterval(() => {
      const remaining = Math.max(0, duration - Math.floor((Date.now() - startedAt) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(interval);
        void end();
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [duration, end, running, startedAt]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!running) {
        return;
      }

      const allowed = binaryKeypad ? /^[01]$/ : /^[0-9./-]$/;
      if (allowed.test(event.key)) {
        event.preventDefault();
        setAnswer((value) => value + event.key);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        setAnswer((value) => value.slice(0, -1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        void submit();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [binaryKeypad, running, submit]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    params.set("star", String(star));
    router.replace(`/play/mental-arithmetic?${params.toString()}`, { scroll: false });
  }, [category, router, searchParams, star]);

  function keypadPress(key: string) {
    inputRef.current?.focus();
    if (key === "backspace") {
      setAnswer((value) => value.slice(0, -1));
    } else if (key === "clear") {
      setAnswer("");
    } else if (key === "enter") {
      void submit();
    } else {
      setAnswer((value) => value + key);
    }
  }

  function toggleOperation(operation: ArithmeticCustomConfig["operations"][number]) {
    setCustomConfig((current) => {
      const hasOperation = current.operations.includes(operation);
      const operations = hasOperation
        ? current.operations.filter((item) => item !== operation)
        : [...current.operations, operation];

      return { ...current, operations: operations.length ? operations : [operation] };
    });
  }

  return (
    <>
    <style>{mentalArithmeticStyles}</style>
    <div className="ma-shell">
      <div className="ma-frame">
        <SurfaceNav variant="dark" labels="compact" />

        <header className="ma-hero">
          <div>
            <p className="ma-kicker">SumTex Play</p>
            <h1 className="ma-title">{pageTitle}</h1>
            <p className="ma-subtitle">
              Fast generated arithmetic drills with timed runs, clean keyboard entry, and signed-in history.
            </p>
          </div>
          <button type="button" onClick={running ? () => void end() : start} className="ma-primary-action">
            {running ? "End run" : "Start run"}
          </button>
        </header>

        <div className="ma-layout">
          <aside className="ma-rail">
            <div className="ma-group">
              <div className="ma-label">Mode</div>
              <label className="ma-toggle-row">
                <span>Custom mode</span>
                <input
                  type="checkbox"
                  checked={customEnabled}
                  onChange={(event) => setCustomEnabled(event.target.checked)}
                />
              </label>
            </div>

            {!customEnabled ? (
              <>
                <div className="ma-group">
                  <div className="ma-label">Category</div>
                  <div className="ma-category-list">
                    {arithmeticCategories.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id)}
                        className={`ma-line-option${category === item.id ? " active" : ""}`}
                      >
                        <span className="ma-option-name">{item.label}</span>
                        <span className="ma-option-meta">{item.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {category === "roots-powers" ? (
                  <div className="ma-group">
                    <div className="ma-label">Submode</div>
                    <Segmented
                      items={submodes}
                      value={submode}
                      onChange={(value) => setSubmode(value as ArithmeticSubmode)}
                    />
                  </div>
                ) : null}

                {category.startsWith("big-") ? (
                  <div className="ma-group">
                    <div className="ma-label">Magnitude</div>
                    <Segmented
                      items={magnitudes}
                      value={magnitude}
                      onChange={(value) => setMagnitude(value as BigMagnitude)}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="ma-group">
                <div className="ma-label">Custom</div>
                <div className="ma-pill-row">
                  {(["addition", "subtraction", "multiplication", "division"] as const).map((operation) => (
                    <button
                      key={operation}
                      type="button"
                      className={`ma-pill${customConfig.operations.includes(operation) ? " active" : ""}`}
                      onClick={() => toggleOperation(operation)}
                    >
                      {operation}
                    </button>
                  ))}
                </div>
                <NumberControl
                  label="Min digits"
                  value={customConfig.minDigits}
                  onChange={(value) => setCustomConfig((current) => ({ ...current, minDigits: value }))}
                />
                <NumberControl
                  label="Max digits"
                  value={customConfig.maxDigits}
                  onChange={(value) => setCustomConfig((current) => ({ ...current, maxDigits: value }))}
                />
                <CheckControl
                  label="Negatives"
                  checked={customConfig.allowNegatives}
                  onChange={(value) => setCustomConfig((current) => ({ ...current, allowNegatives: value }))}
                />
                <CheckControl
                  label="Decimals"
                  checked={customConfig.allowDecimals}
                  onChange={(value) => setCustomConfig((current) => ({ ...current, allowDecimals: value }))}
                />
                <CheckControl
                  label="Fractions"
                  checked={customConfig.allowFractions}
                  onChange={(value) => setCustomConfig((current) => ({ ...current, allowFractions: value }))}
                />
                <CheckControl
                  label="Clean division"
                  checked={customConfig.cleanDivision}
                  onChange={(value) => setCustomConfig((current) => ({ ...current, cleanDivision: value }))}
                />
              </div>
            )}

            <div className="ma-group">
              <div className="ma-label">Stars</div>
              <div className="ma-pill-row">
                {([1, 2, 3, 4, 5] as ArithmeticStar[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`ma-pill${star === value ? " active" : ""}`}
                    onClick={() => setStar(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="ma-group">
              <div className="ma-label">Run</div>
              <Segmented items={runModes} value={runMode} onChange={(value) => setRunMode(value as ArithmeticRunMode)} />
            </div>
          </aside>

          <section className="ma-stage">
            <div className="ma-metrics">
              <Metric label="Score" value={score} />
              <Metric label={runMode === "untimed" ? "Mode" : "Time"} value={runMode === "untimed" ? "Open" : `${timeLeft ?? duration}s`} />
              <Metric label="Accuracy" value={total ? `${Math.round((correct / total) * 100)}%` : "0%"} />
            </div>

            {problem ? (
              <div className="ma-problem-wrap">
                <div className={`ma-expression${feedback ? ` ${feedback}` : ""}`}>{problem.expression}</div>

                <input
                  ref={inputRef}
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  className="ma-answer"
                  inputMode={binaryKeypad ? "numeric" : "decimal"}
                  autoFocus
                />

                <Keypad binary={binaryKeypad} onPress={keypadPress} />
              </div>
            ) : (
              <div className="ma-empty">
                <h2>{ended ? "Run complete" : "Ready"}</h2>
                <p>
                  {ended && !sessionId
                    ? "Guest runs stay on this device. Sign in to save future arithmetic history."
                    : "Choose a drill and start. The answer input stays keypad-first."}
                </p>
              </div>
            )}

            {recent.length ? (
              <div className="ma-recent">
                <h3>Recent attempts</h3>
                <div>
                  {recent.map((item, index) => (
                    <div key={`${item.expression}-${index}`} className="ma-recent-row">
                      <span>
                        {item.expression} = {item.userAnswer || "blank"}
                      </span>
                      <span style={{ color: item.correct ? "#7fb68d" : "#c98462" }}>
                        {item.correct ? "Correct" : item.answer}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
    </>
  );
}

function Keypad({ binary, onPress }: { binary: boolean; onPress: (key: string) => void }) {
  const keys = binary
    ? ["1", "0", "backspace", "clear", "enter"]
    : ["7", "8", "9", "backspace", "4", "5", "6", "clear", "1", "2", "3", "-", "0", ".", "/", "enter"];

  return (
    <div className="ma-keypad">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          className="ma-key"
          onClick={() => onPress(key)}
        >
          {key === "backspace" ? "Bksp" : key === "clear" ? "C" : key === "enter" ? "Enter" : key}
        </button>
      ))}
    </div>
  );
}

function Segmented({
  items,
  value,
  onChange,
}: {
  items: Array<{ id: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="ma-pill-row">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`ma-pill${value === item.id ? " active" : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function NumberControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="ma-number-row">
      {label}
      <input
        type="number"
        min={1}
        max={9}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function CheckControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="ma-toggle-row">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="ma-metric">
      <div className="ma-metric-label">{label}</div>
      <div className="ma-metric-value">{value}</div>
    </div>
  );
}

function parseCategory(value: string | null): ArithmeticCategory {
  return arithmeticCategories.some((item) => item.id === value)
    ? (value as ArithmeticCategory)
    : "addition";
}

function parseStar(value: string | null): ArithmeticStar {
  const numeric = Number(value);
  return ([1, 2, 3, 4, 5] as ArithmeticStar[]).includes(numeric as ArithmeticStar)
    ? (numeric as ArithmeticStar)
    : 2;
}

const mentalArithmeticStyles = `
  .ma-shell {
    --surface-bg: #ffffff;
    --surface-bg-soft: #f6f6f6;
    --surface-control: #ffffff;
    --surface-text: #171717;
    --surface-strong: #000000;
    --surface-muted: #555555;
    --surface-faint: #8a8a8a;
    --surface-line: #dedede;
    --surface-line-soft: #e9e9e9;
    --surface-invert: #000000;
    --surface-invert-text: #ffffff;
    min-height: 100vh;
    background: var(--surface-bg);
    color: var(--surface-text);
    padding: 28px 5vw 56px;
  }
  .dark .ma-shell {
    --surface-bg: #080808;
    --surface-bg-soft: #0d0d0d;
    --surface-control: #111;
    --surface-text: #f4f2ee;
    --surface-strong: #f5f3ef;
    --surface-muted: #8d8d8d;
    --surface-faint: #777;
    --surface-line: #242424;
    --surface-line-soft: #1d1d1d;
    --surface-invert: #f1eee8;
    --surface-invert-text: #080808;
  }
  .ma-shell a { color: inherit; text-decoration: none; }
  .ma-frame { margin: 0 auto; max-width: 1440px; }
  .ma-hero { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; margin: 0 0 46px; }
  .ma-kicker, .ma-label, .ma-metric-label, .ma-recent h3 { color: var(--surface-faint); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; line-height: 1; text-transform: uppercase; }
  .ma-kicker { font-size: 13px; letter-spacing: 0.18em; margin: 0 0 22px; }
  .ma-title { color: var(--surface-strong); font-size: clamp(44px, 6vw, 92px); font-weight: 400; letter-spacing: 0; line-height: 0.95; margin: 0; }
  .ma-subtitle { color: var(--surface-muted); font-size: 18px; line-height: 1.5; margin: 22px 0 0; max-width: 620px; }
  .ma-primary-action { align-items: center; background: transparent; border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-strong); cursor: pointer; display: inline-flex; font-family: var(--font-mono); font-size: 13px; font-weight: 600; justify-content: center; letter-spacing: 0.14em; min-height: 54px; padding: 0 28px; text-transform: uppercase; white-space: nowrap; }
  .ma-primary-action:hover { background: var(--surface-bg-soft); border-color: var(--surface-muted); }
  .ma-layout { align-items: start; display: grid; gap: 44px; grid-template-columns: minmax(260px, 360px) minmax(0, 1fr); }
  .ma-rail { border-left: 1px solid var(--surface-line); display: flex; flex-direction: column; gap: 32px; padding-left: 26px; }
  .ma-group { display: grid; gap: 12px; }
  .ma-category-list { display: grid; gap: 1px; }
  .ma-line-option, .ma-toggle-row, .ma-number-row { background: transparent; border: 0; border-bottom: 1px solid var(--surface-line-soft); color: var(--surface-text); display: flex; gap: 16px; justify-content: space-between; min-height: 46px; padding: 12px 0; text-align: left; }
  .ma-line-option { cursor: pointer; }
  .ma-line-option:hover, .ma-line-option.active { color: var(--surface-strong); }
  .ma-option-name { align-items: center; display: inline-flex; font-size: 15px; gap: 10px; }
  .ma-option-name:before { background: var(--surface-line); border-radius: 999px; content: ""; display: inline-block; height: 7px; width: 7px; }
  .ma-line-option.active .ma-option-name:before { background: var(--surface-strong); }
  .ma-option-meta { color: var(--surface-faint); font-size: 12px; max-width: 130px; text-align: right; }
  .ma-pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .ma-pill { background: transparent; border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-muted); cursor: pointer; font-family: var(--font-mono); font-size: 12px; min-height: 36px; padding: 0 14px; text-transform: uppercase; }
  .ma-pill.active { background: var(--surface-invert); border-color: var(--surface-invert); color: var(--surface-invert-text); }
  .ma-stage { border-left: 1px solid var(--surface-line); min-height: 650px; padding-left: clamp(28px, 5vw, 76px); }
  .ma-metrics { display: grid; gap: 1px; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0 0 42px; }
  .ma-metric { border-top: 1px solid var(--surface-line); padding: 18px 22px 0 0; }
  .ma-metric-value { color: var(--surface-strong); font-family: var(--font-mono); font-size: 30px; line-height: 1.2; margin-top: 8px; }
  .ma-problem-wrap { margin: 0 auto; max-width: 760px; text-align: center; }
  .ma-expression { color: var(--surface-strong); font-family: var(--font-mono); font-size: clamp(46px, 7vw, 96px); font-weight: 500; letter-spacing: 0; line-height: 1.05; margin: 50px 0 34px; min-height: 110px; }
  .ma-expression.correct { color: #7fb68d; }
  .ma-expression.wrong { color: #c98462; }
  .ma-answer { background: var(--surface-control); border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-strong); font-family: var(--font-mono); font-size: 28px; height: 66px; outline: none; padding: 0 26px; text-align: center; width: min(100%, 560px); }
  .ma-answer:focus { border-color: var(--surface-muted); }
  .ma-keypad { display: grid; gap: 10px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 24px auto 0; max-width: 560px; }
  .ma-key { background: var(--surface-control); border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-text); cursor: pointer; font-family: var(--font-mono); font-size: 15px; height: 52px; }
  .ma-key:hover { background: var(--surface-bg-soft); border-color: var(--surface-muted); }
  .ma-empty { align-items: center; display: flex; flex-direction: column; justify-content: center; min-height: 450px; text-align: center; }
  .ma-empty h2 { color: var(--surface-strong); font-size: clamp(42px, 6vw, 82px); font-weight: 400; letter-spacing: 0; line-height: 1; margin: 0; }
  .ma-empty p { color: var(--surface-muted); font-size: 17px; line-height: 1.5; margin: 20px 0 0; max-width: 520px; }
  .ma-recent { border-top: 1px solid var(--surface-line); margin-top: 52px; padding-top: 22px; }
  .ma-recent h3 { margin: 0 0 14px; }
  .ma-recent-row { border-bottom: 1px solid var(--surface-line-soft); color: var(--surface-muted); display: grid; font-family: var(--font-mono); font-size: 13px; gap: 16px; grid-template-columns: 1fr auto; padding: 12px 0; }
  .ma-number-row, .ma-toggle-row { align-items: center; cursor: default; }
  .ma-number-row input { background: var(--surface-control); border: 1px solid var(--surface-line); border-radius: 999px; color: var(--surface-strong); height: 34px; padding: 0 12px; text-align: center; width: 78px; }
  .ma-toggle-row input { accent-color: var(--surface-invert); }
  @media (max-width: 900px) {
    .ma-shell { padding: 28px 20px 48px; }
    .ma-hero { align-items: stretch; flex-direction: column; margin-bottom: 34px; }
    .ma-layout { grid-template-columns: 1fr; }
    .ma-rail, .ma-stage { border-left: 0; padding-left: 0; }
  }
`;
