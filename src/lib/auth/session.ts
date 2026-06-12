import "server-only";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function getSession() {
  const session = await withAuth();
  return session;
}

export async function requireSession() {
  const session = await withAuth({ ensureSignedIn: true });
  return session;
}
