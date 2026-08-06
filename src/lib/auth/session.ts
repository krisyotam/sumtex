import "server-only";
import { auth } from "@clerk/nextjs/server";

export async function getSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session.isAuthenticated) {
    throw new Error("Unauthorized");
  }

  return session;
}
