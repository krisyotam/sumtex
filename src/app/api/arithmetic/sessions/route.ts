import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getCurrentLocalUser } from "@/lib/auth/user";
import { db } from "@/lib/db";
import { arithmeticSessions } from "@/lib/db/schema";

const payloadSchema = z.object({
  config: z.object({
    mode: z.enum(["standard", "custom"]),
    category: z.string(),
    submode: z.string().optional(),
    star: z.number().int().min(1).max(5),
    runMode: z.enum(["untimed", "30s", "60s", "120s", "300s"]),
    magnitude: z.string().optional(),
    customConfig: z.unknown().optional(),
  }),
  seed: z.number().int(),
});

export async function POST(request: Request) {
  const clerkSession = await auth();

  if (!clerkSession.isAuthenticated) {
    return NextResponse.json({ persisted: false, sessionId: null });
  }

  const payload = payloadSchema.parse(await request.json());
  const user = await getCurrentLocalUser();

  if (!user) {
    return NextResponse.json({ persisted: false, sessionId: null });
  }

  const durationSeconds =
    payload.config.runMode === "untimed" ? null : Number(payload.config.runMode.replace("s", ""));
  const [createdSession] = await db
    .insert(arithmeticSessions)
    .values({
      userId: user.id,
      mode: payload.config.mode,
      category: payload.config.category,
      submode: payload.config.submode ?? null,
      star: payload.config.star,
      customConfig: payload.config.customConfig,
      seed: payload.seed,
      durationSeconds,
    })
    .returning({ id: arithmeticSessions.id });

  return NextResponse.json({ persisted: true, sessionId: createdSession?.id ?? null });
}
