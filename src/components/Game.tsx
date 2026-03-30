"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import katex from "katex";
import { Problem } from "@/data/types";
import { demoProblems } from "@/data/problems-demo";
import { typesettingProblems } from "@/data/problems-typesetting";
import { normalize } from "@/data/normalizations";
import KaTeX from "./KaTeX";
import Leaderboard from "./Leaderboard";

type GameState = "intro" | "playing" | "ended";
type GameMode = "timed" | "zen";

const TIMEOUT_SECONDS = 180;

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(secs: number): string {
  const minutes = Math.floor(secs / 60) % 60;
  const seconds = secs % 60;
  return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

// Determine which problem set to use based on whether problems have solutions
function getProblems(): { problems: Problem[]; mode: "solve" | "typeset" } {
  if (demoProblems.length > 0 && demoProblems[0].solution) {
    return { problems: demoProblems, mode: "solve" };
  }
  return { problems: typesettingProblems, mode: "typeset" };
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [gameMode, setGameMode] = useState<GameMode>("timed");
  const [secondsRemaining, setSecondsRemaining] = useState(TIMEOUT_SECONDS);
  const [score, setScore] = useState(0);
  const [numCorrect, setNumCorrect] = useState(0);
  const [problemNumber, setProblemNumber] = useState(0);
  const [problemPoints, setProblemPoints] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [problemsOrder, setProblemsOrder] = useState<number[]>([]);
  const [skippedProblems, setSkippedProblems] = useState<number[]>([]);
  const [showSkipped, setShowSkipped] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const { problems, mode } = getProblems();

  const currentProblem = problemsOrder.length > 0
    ? problems[problemsOrder[problemNumber % problems.length]]
    : null;

  // Update preview
  useEffect(() => {
    if (previewRef.current && gameState === "playing") {
      const val = normalize(userInput);
      try {
        katex.render(val, previewRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch {
        // ignore render errors
      }
    }
  }, [userInput, gameState]);

  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState("ended");
  }, []);

  // Timer
  useEffect(() => {
    if (gameState === "playing" && gameMode === "timed") {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState, gameMode, endGame]);

  function startGame(timedMode: GameMode) {
    const order = shuffleArray([...Array(problems.length).keys()]);
    setProblemsOrder(order);
    setProblemNumber(0);
    setScore(0);
    setNumCorrect(0);
    setSkippedProblems([]);
    setShowSkipped(false);
    setGameMode(timedMode);
    setSecondsRemaining(TIMEOUT_SECONDS);
    setGameState("playing");
    setUserInput("");
    setShowHint(false);
    setCheckFeedback(null);
    setIsCorrect(false);
    setIsDisabled(false);

    // Set points for first problem
    const firstProblem = problems[order[0]];
    setProblemPoints(Math.ceil(firstProblem.latex.length / 10.0));

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function loadNextProblem() {
    const nextNum = problemNumber + 1;
    setProblemNumber(nextNum);
    setUserInput("");
    setShowHint(false);
    setCheckFeedback(null);
    setIsCorrect(false);
    setIsDisabled(false);

    const nextProblem = problems[problemsOrder[nextNum % problems.length]];
    setProblemPoints(Math.ceil(nextProblem.latex.length / 10.0));

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleSkip() {
    setSkippedProblems((prev) => [...prev, problemNumber]);
    loadNextProblem();
  }

  function handleShowHint() {
    setShowHint(true);
    setProblemPoints((prev) => Math.max(1, Math.floor(prev * 0.5)));
  }

  function checkAnswer() {
    if (!currentProblem) return;

    const userAnswer = normalize(userInput.trim());

    if (mode === "solve" && currentProblem.solution) {
      const correctAnswer = normalize(currentProblem.solution);
      if (userAnswer === correctAnswer) {
        markCorrect();
      } else {
        setCheckFeedback("Try Again");
        setTimeout(() => setCheckFeedback(null), 1000);
      }
    } else {
      // Typesetting mode: compare against the latex source
      const target = normalize(currentProblem.latex);
      if (userAnswer === target) {
        markCorrect();
      } else {
        setCheckFeedback("Try Again");
        setTimeout(() => setCheckFeedback(null), 1000);
      }
    }
  }

  function markCorrect() {
    setScore((prev) => prev + problemPoints);
    setNumCorrect((prev) => prev + 1);
    setIsCorrect(true);
    setIsDisabled(true);
    setCheckFeedback("Correct! ✓");

    setTimeout(() => {
      loadNextProblem();
    }, 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      checkAnswer();
    }
  }

  // INTRO SCREEN
  if (gameState === "intro") {
    return (
      <div id="container">
        <div id="title" className="centered-text">
          <KaTeX math={String.raw`\text{Sum\TeX}`} />
        </div>
        <div id="subtitle" className="centered-text">
          <KaTeX math={String.raw`\text{A \LaTeX \, Math Game}`} />
        </div>

        <br /><br />

        <div id="intro-window">
          <p>
            {mode === "solve"
              ? "This is a math game to test your problem-solving skills."
              : "This is a game to test your LaTeX typesetting skills."}
            <br /><br />
            {mode === "solve"
              ? "Solve as many math problems as you can in three minutes (timed game), or play an untimed game (zen mode)!"
              : "Recreate as many formulas as you can in three minutes (timed game), or play an untimed game (zen mode)!"}
          </p>

          <br /><br />

          <button className="latex-button" onClick={() => startGame("timed")}>
            Timed Game
          </button>
          <button className="latex-button" onClick={() => startGame("zen")}>
            Zen Mode
          </button>

          <br /><br /><br />

          <div id="hint-text">
            <b>Tips:</b>
            <ul id="hint-list">
              {mode === "solve" ? (
                <>
                  <li>Enter answers in LaTeX format (no $ signs needed)</li>
                  <li>Use <KaTeX math={String.raw`\verb|\frac{a}{b}|`} /> for fractions</li>
                  <li>Use <KaTeX math={String.raw`\verb|x^2|`} /> for exponents and <KaTeX math={String.raw`\verb|x_1|`} /> for subscripts</li>
                  <li>Use <KaTeX math={String.raw`\verb|\sqrt{x}|`} /> for square roots</li>
                  <li>Use <KaTeX math={String.raw`\verb|\text{or}|`} /> to separate multiple solutions</li>
                  <li>Click &quot;Show Hint&quot; if you&apos;re stuck</li>
                  <li>Harder problems are worth more points</li>
                </>
              ) : (
                <>
                  <li>Enter your answer in LaTeX format (no $ signs needed)</li>
                  <li>Use <KaTeX math={String.raw`\verb|\frac{a}{b}|`} /> for fractions</li>
                  <li>Use <KaTeX math={String.raw`\verb|x^2|`} /> for exponents and <KaTeX math={String.raw`\verb|x_1|`} /> for subscripts</li>
                  <li>Use <KaTeX math={String.raw`\verb|\sqrt{x}|`} /> for square roots</li>
                  <li>Longer formulas are worth more points</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // GAME SCREEN
  if (gameState === "playing" && currentProblem) {
    return (
      <div id="container" style={{ display: "block" }}>
        <div id="title" className="centered-text">
          <KaTeX math={String.raw`\text{Sum\TeX}`} />
        </div>

        <div id="game-window">
          <div id="top-row">
            <span id="left-buttons">
              <button className="latex-button" onClick={handleSkip}>
                Skip This Problem
              </button>
              <button className="latex-button" onClick={endGame}>
                End Game
              </button>
            </span>
            <span id="score-wrapper">
              <b>Score:&nbsp;</b>
              <span id="score">{score}</span>
            </span>
            <span id="timer-wrapper">
              <b>Time:&nbsp;</b>
              <span id="timer">
                {gameMode === "timed" ? (
                  formatTime(secondsRemaining)
                ) : (
                  <KaTeX math={String.raw`\infty`} />
                )}
              </span>
            </span>
          </div>

          <br /><br />

          <p className="problem-header">
            <span className="title">
              Problem {problemNumber + 1}: {currentProblem.title}
            </span>
            &nbsp;
            <span id="problem-points">
              ({problemPoints} {problemPoints === 1 ? "point" : "points"})
            </span>
          </p>

          <p>{mode === "solve" ? "Solve the following problem:" : "Reproduce the following formula:"}</p>

          <div className="latex">
            <KaTeX math={currentProblem.latex} displayMode className="target-math" />
          </div>

          <br />

          {showHint && currentProblem.hint && (
            <div id="hint-container">
              <p>
                <strong>Hint:</strong>{" "}
                <KaTeX math={currentProblem.hint} />
              </p>
            </div>
          )}

          <p>Enter your answer:</p>

          <textarea
            ref={inputRef}
            className="latex-source"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder="Type your answer in LaTeX format..."
          />

          <br />

          {mode === "solve" && currentProblem.hint && !showHint && (
            <button className="latex-button" onClick={handleShowHint}>
              Show Hint
            </button>
          )}
          <button
            className="latex-button"
            onClick={checkAnswer}
            disabled={isDisabled}
          >
            {checkFeedback || "Check Answer"}
          </button>

          <br />

          <p>Your answer preview:</p>

          <div className="out-container">
            <div className={`latex out ${isCorrect ? "correct" : ""}`}>
              <div ref={previewRef} id="out" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // END SCREEN
  if (gameState === "ended") {
    const problemsText = numCorrect + (numCorrect === 1 ? " problem" : " problems");

    return (
      <div id="container" style={{ display: "block" }}>
        <div id="title" className="centered-text">
          <KaTeX math={String.raw`\text{Sum\TeX}`} />
        </div>

        <div id="ending-window">
          <h1>Game Over!</h1>
          <p>
            You finished {problemsText} for a total score of {score}
          </p>

          <Leaderboard currentScore={score} />

          {skippedProblems.length > 0 && (
            <>
              <p>Check out the problems you skipped?</p>
              <button
                className="latex-button"
                onClick={() => setShowSkipped(!showSkipped)}
              >
                {showSkipped ? "Hide Skipped" : "Show Skipped"}
              </button>

              {showSkipped && (
                <div id="skipped-problems">
                  {skippedProblems.map((idx) => {
                    const prob = problems[problemsOrder[idx % problems.length]];
                    return (
                      <div key={idx} style={{ marginBottom: "2em" }}>
                        <p className="problem-header">
                          <span className="title">{prob.title}</span>
                        </p>
                        <p><strong>Problem:</strong></p>
                        <div className="latex">
                          <KaTeX math={prob.latex} displayMode />
                        </div>
                        <br />
                        {prob.solution && (
                          <>
                            <p><strong>Solution:</strong></p>
                            <div className="latex">
                              <KaTeX math={prob.solution} displayMode />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          <br /><br />
          <button className="latex-button" onClick={() => setGameState("intro")}>
            Play Again!
          </button>
        </div>
      </div>
    );
  }

  return null;
}
