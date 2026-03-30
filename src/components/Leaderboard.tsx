"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

type TimeRange = "today" | "month" | "all-time";

interface LeaderboardEntry {
  name: string;
  score: number;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export default function Leaderboard({ currentScore }: { currentScore: number }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadLeaderboard(range: TimeRange) {
    setLoading(true);
    try {
      const ref = collection(db, "leaderboard");
      let q;

      const now = new Date();
      if (range === "today") {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        q = query(ref, where("timestamp", ">=", Timestamp.fromDate(startOfDay)), orderBy("score", "desc"), limit(10));
      } else if (range === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        q = query(ref, where("timestamp", ">=", Timestamp.fromDate(startOfMonth)), orderBy("score", "desc"), limit(10));
      } else {
        q = query(ref, orderBy("score", "desc"), limit(10));
      }

      const snapshot = await getDocs(q);
      const results: LeaderboardEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        results.push({ name: data.name, score: data.score });
      });
      setEntries(results);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
    }
    setLoading(false);
  }

  async function submitScore() {
    const name = playerName.trim();
    if (!name) {
      alert("Please enter your name");
      return;
    }
    if (name.length > 30) {
      alert("Name must be 30 characters or less");
      return;
    }
    try {
      await addDoc(collection(db, "leaderboard"), {
        name,
        score: currentScore,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
      loadLeaderboard(timeRange);
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  }

  useEffect(() => {
    loadLeaderboard(timeRange);
  }, [timeRange]);

  return (
    <div>
      {!submitted && (
        <div className="score-submission">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={30}
            placeholder="Enter your name"
            className="player-name-input"
          />
          <button className="latex-button" onClick={submitScore}>
            Submit Score
          </button>
        </div>
      )}

      <h2>Leaderboard</h2>
      <div className="leaderboard-controls">
        {(["today", "month", "all-time"] as TimeRange[]).map((range) => (
          <button
            key={range}
            className={`latex-button ${timeRange === range ? "active" : ""}`}
            onClick={() => setTimeRange(range)}
          >
            {range === "today" ? "Today" : range === "month" ? "This Month" : "All Time"}
          </button>
        ))}
      </div>
      <div className="leaderboard-list">
        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No scores yet!</p>
        ) : (
          entries.map((entry, i) => (
            <div key={i} className="leaderboard-entry">
              <span className="rank">#{i + 1}</span>
              <span className="name">{escapeHtml(entry.name)}</span>
              <span className="score">{entry.score} points</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
