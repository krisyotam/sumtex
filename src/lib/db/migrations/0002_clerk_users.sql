ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "clerk_id" text;

UPDATE "users"
SET "clerk_id" = "workos_id"
WHERE "clerk_id" IS NULL
  AND "workos_id" IS NOT NULL;

ALTER TABLE "users" ALTER COLUMN "clerk_id" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_id_idx" ON "users" ("clerk_id");
DROP INDEX IF EXISTS "users_workos_id_idx";
ALTER TABLE "users" DROP COLUMN IF EXISTS "workos_id";
