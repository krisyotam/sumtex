import { Header } from "@/components/navigation/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-canvas)" }}
    >
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
