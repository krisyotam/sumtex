import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { subjects, forumCategories } from "../src/lib/db/schema";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("Seeding subjects...");
  await db
    .insert(subjects)
    .values([
      { slug: "algebra", name: "Algebra", displayOrder: 1 },
      { slug: "linear-algebra", name: "Linear Algebra", displayOrder: 2 },
      { slug: "calculus", name: "Calculus", displayOrder: 3 },
      { slug: "analysis", name: "Analysis", displayOrder: 4 },
      { slug: "number-theory", name: "Number Theory", displayOrder: 5 },
      { slug: "topology", name: "Topology", displayOrder: 6 },
      { slug: "geometry", name: "Geometry", displayOrder: 7 },
      { slug: "combinatorics", name: "Combinatorics", displayOrder: 8 },
      { slug: "probability", name: "Probability", displayOrder: 9 },
      { slug: "logic", name: "Logic", displayOrder: 10 },
      { slug: "set-theory", name: "Set Theory", displayOrder: 11 },
      { slug: "differential-equations", name: "Differential Equations", displayOrder: 12 },
    ])
    .onConflictDoNothing();

  console.log("Seeding forum categories...");
  await db
    .insert(forumCategories)
    .values([
      { slug: "general", name: "General", description: "General mathematics discussion", displayOrder: 1 },
      { slug: "problem-discussion", name: "Problem Discussion", description: "Discuss specific problems and solutions", displayOrder: 2 },
      { slug: "textbooks", name: "Textbooks", description: "Textbook recommendations and reviews", displayOrder: 3 },
      { slug: "feedback", name: "Feedback", description: "Site feedback and feature requests", displayOrder: 4 },
    ])
    .onConflictDoNothing();

  console.log("Seed complete.");
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
