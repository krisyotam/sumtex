import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getCurrentLocalUser } from "@/lib/auth/user";
import { db } from "@/lib/db";
import { arithmeticAttempts, arithmeticSessions } from "@/lib/db/schema";

const payloadSchema = z.object({
  sessionId: z.string().uuid().nullable(),
  problem: z.object({
    category: z.string(),
    submode: z.string().optional(),
    star: z.number().int().min(1).max(5),
    expression: z.string(),
    canonicalAnswer: z.string(),
    answerFormat: z.string(),
    acceptsFractions: z.boolean(),
    acceptsDecimals: z.boolean(),
    metadata: z.record(z.string(), z.unknown()),
  }),
  userAnswer: z.string(),
  correct: z.boolean(),
  elapsedMs: z.number().int().min(0),
  scoreDelta: z.number().int().min(0),
});

export async function POST(request: Request) {
  const clerkSession = await auth();
  const payload = payloadSchema.parse(await request.json());

  if (!clerkSession.isAuthenticated || !payload.sessionId) {
    return NextResponse.json({ persisted: false });
  }

  const user = await getCurrentLocalUser();

  if (!user) {
    return NextResponse.json({ persisted: false });
  }

  const arithmeticSession = await db.query.arithmeticSessions.findFirst({
    where: and(
      eq(arithmeticSessions.id, payload.sessionId),
      eq(arithmeticSessions.userId, user.id)
    ),
  });

  if (!arithmeticSession) {
    return NextResponse.json({ persisted: false }, { status: 404 });
  }

  await db.insert(arithmeticAttempts).values({
    sessionId: payload.sessionId,
    generatedPrompt: payload.problem,
    displayExpression: payload.problem.expression,
    canonicalAnswer: payload.problem.canonicalAnswer,
    userAnswer: payload.userAnswer,
    correct: payload.correct,
    elapsedMs: payload.elapsedMs,
    scoreDelta: payload.scoreDelta,
    category: payload.problem.category,
    submode: payload.problem.submode ?? null,
    star: payload.problem.star,
    metadata: payload.problem.metadata,
  });

  await db
    .update(arithmeticSessions)
    .set({
      score: sql`${arithmeticSessions.score} + ${payload.scoreDelta}`,
      totalAttempts: sql`${arithmeticSessions.totalAttempts} + 1`,
      correctAttempts: sql`${arithmeticSessions.correctAttempts} + ${payload.correct ? 1 : 0}`,
    })
    .where(eq(arithmeticSessions.id, payload.sessionId));

  return NextResponse.json({ persisted: true });
}
