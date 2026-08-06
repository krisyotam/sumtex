CREATE TABLE IF NOT EXISTS "arithmetic_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "mode" varchar(20) NOT NULL,
  "category" varchar(40) NOT NULL,
  "submode" varchar(20),
  "star" integer,
  "custom_config" jsonb,
  "seed" integer NOT NULL,
  "duration_seconds" integer,
  "score" integer DEFAULT 0 NOT NULL,
  "total_attempts" integer DEFAULT 0 NOT NULL,
  "correct_attempts" integer DEFAULT 0 NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "ended_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "arithmetic_attempts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "session_id" uuid NOT NULL REFERENCES "arithmetic_sessions"("id") ON DELETE cascade,
  "generated_prompt" jsonb NOT NULL,
  "display_expression" text NOT NULL,
  "canonical_answer" varchar(120) NOT NULL,
  "user_answer" varchar(120) NOT NULL,
  "correct" boolean NOT NULL,
  "elapsed_ms" integer NOT NULL,
  "score_delta" integer DEFAULT 0 NOT NULL,
  "category" varchar(40) NOT NULL,
  "submode" varchar(20),
  "star" integer,
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "arithmetic_sessions_user_idx" ON "arithmetic_sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "arithmetic_sessions_category_idx" ON "arithmetic_sessions" ("category");
CREATE INDEX IF NOT EXISTS "arithmetic_sessions_started_idx" ON "arithmetic_sessions" ("started_at");
CREATE INDEX IF NOT EXISTS "arithmetic_attempts_session_idx" ON "arithmetic_attempts" ("session_id");
CREATE INDEX IF NOT EXISTS "arithmetic_attempts_category_idx" ON "arithmetic_attempts" ("category");
CREATE INDEX IF NOT EXISTS "arithmetic_attempts_created_idx" ON "arithmetic_attempts" ("created_at");
