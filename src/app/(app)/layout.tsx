export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-canvas)" }}
    >
      <main className="flex-1">{children}</main>
    </div>
  );
}
