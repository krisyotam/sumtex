export default function PlayPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1
        className="text-2xl font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Play
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Select a mode to begin solving problems.
      </p>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div
          className="p-6 rounded-lg border cursor-pointer transition-colors"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h2
            className="text-lg font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Timed
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            3 minutes. Solve as many problems as you can. 1.5x XP multiplier.
          </p>
        </div>
        <div
          className="p-6 rounded-lg border cursor-pointer transition-colors"
          style={{
            background: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h2
            className="text-lg font-medium mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Zen
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No timer. Work through problems at your own pace.
          </p>
        </div>
      </div>
    </div>
  );
}
