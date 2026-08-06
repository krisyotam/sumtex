import { UserProfile } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { SurfaceNav } from "@/components/navigation/surfaceNav";

export default async function SettingsPage() {
  const user = await currentUser();

  return (
    <main className="settings-shell">
      <style>{settingsStyles}</style>
      <div className="settings-frame">
        <SurfaceNav variant="light" />
        <section className="settings-head">
          <p>SumTex Profile</p>
          <h1>Account management</h1>
        </section>
        {user ? (
          <UserProfile
            routing="path"
            path="/profile/settings"
            appearance={{
              elements: {
                rootBox: "settings-clerk-root",
                cardBox: "settings-clerk-card",
              },
            }}
          />
        ) : (
          <section className="settings-empty">
            <h2>Sign in to manage your account.</h2>
            <a href="/sign-in">Sign in</a>
          </section>
        )}
      </div>
    </main>
  );
}

const settingsStyles = `
  .settings-shell { min-height: 100vh; background: #f0f0f0; color: #333; padding: 28px 20px 72px; }
  .dark .settings-shell { background: #0d0d0d; color: #fff; }
  .settings-frame { margin: 0 auto; max-width: 980px; }
  .settings-head { margin: 0 0 28px; }
  .settings-head p { color: #777; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; margin: 0 0 10px; text-transform: uppercase; }
  .settings-head h1 { color: inherit; font-size: clamp(38px, 6vw, 72px); font-weight: 400; letter-spacing: 0; line-height: 1; margin: 0; }
  .settings-empty { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 28px; }
  .dark .settings-empty { background: #111; border-color: #2a2a2a; }
  .settings-empty h2 { color: inherit; font-size: 22px; font-weight: 500; letter-spacing: 0; margin: 0 0 18px; }
  .settings-empty a { border: 1px solid #d8d8d8; border-radius: 999px; color: inherit; display: inline-flex; font-family: var(--font-mono); font-size: 12px; height: 36px; align-items: center; padding: 0 14px; text-decoration: none; text-transform: uppercase; }
  .settings-clerk-root { width: 100%; }
  .settings-clerk-card { border-radius: 8px; box-shadow: none; width: 100%; }
`;
