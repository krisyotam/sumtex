import "server-only";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

export async function getCurrentLocalUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  return ensureLocalUser(clerkUser);
}

export async function ensureLocalUser(clerkUser: ClerkUser) {
  const existing = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUser.id),
  });

  const email = primaryEmail(clerkUser);
  const displayName =
    clerkUser.fullName ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");
  const username = usernameFromClerk(clerkUser, email);

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        displayName: displayName || existing.displayName,
        email,
        avatarUrl: clerkUser.imageUrl,
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning();

    return updated ?? existing;
  }

  const [created] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      username,
      displayName: displayName || username,
      email,
      avatarUrl: clerkUser.imageUrl,
      lastActiveAt: new Date(),
    })
    .returning();

  return created;
}

function primaryEmail(clerkUser: ClerkUser): string {
  return (
    clerkUser.primaryEmailAddress?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    `${clerkUser.id}@users.sumtex.local`
  );
}

function usernameFromClerk(clerkUser: ClerkUser, email: string): string {
  const base = (clerkUser.username || email.split("@")[0] || "user")
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 28);
  const suffix = clerkUser.id.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toLowerCase();
  return `${base || "user"}${suffix}`;
}
