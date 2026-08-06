import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getCurrentLocalUser } from "@/lib/auth/user";
import { db } from "@/lib/db";
import { arithmeticSessions } from "@/lib/db/schema";

const payloadSchema = z.object({
  sessionId: z.string().uuid().nullable(),
  score: z.number().int().min(0),
  totalAttempts: z.number().int().min(0),
  correctAttempts: z.number().int().min(0),
});

export async function POST(request: Request) {
  const session = await auth();
  const payload = payloadSchema.parse(await request.json());

  if (!session.isAuthenticated || !payload.sessionId) {
    return NextResponse.json({ persisted: false });
  }

  const user = await getCurrentLocalUser();

  if (!user) {
    return NextResponse.json({ persisted: false });
  }

  await db
    .update(arithmeticSessions)
    .set({
      score: payload.score,
      totalAttempts: payload.totalAttempts,
      correctAttempts: payload.correctAttempts,
      endedAt: new Date(),
    })
    .where(
      and(eq(arithmeticSessions.id, payload.sessionId), eq(arithmeticSessions.userId, user.id))
    );

  return NextResponse.json({ persisted: true });
}
