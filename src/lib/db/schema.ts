import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// USERS
// ============================================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull(),
    username: varchar("username", { length: 40 }).notNull(),
    displayName: varchar("display_name", { length: 100 }),
    email: varchar("email", { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    websiteUrl: text("website_url"),
    xHandle: varchar("x_handle", { length: 40 }),
    customCss: text("custom_css"),
    xp: integer("xp").notNull().default(0),
    streakCurrent: integer("streak_current").notNull().default(0),
    streakLongest: integer("streak_longest").notNull().default(0),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_clerk_id_idx").on(t.clerkId),
    uniqueIndex("users_username_idx").on(t.username),
    uniqueIndex("users_email_idx").on(t.email),
  ]
);

// ============================================================
// SUBJECTS
// ============================================================

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 60 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 60 }),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (t) => [uniqueIndex("subjects_slug_idx").on(t.slug)]
);

// ============================================================
// TEXTBOOKS
// ============================================================

export const textbooks = pgTable(
  "textbooks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    author: varchar("author", { length: 300 }).notNull(),
    edition: varchar("edition", { length: 40 }),
    isbn: varchar("isbn", { length: 20 }),
    year: integer("year"),
    publisher: varchar("publisher", { length: 200 }),
    coverUrl: text("cover_url"),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("textbooks_slug_idx").on(t.slug)]
);

// ============================================================
// PROBLEMS
// ============================================================

export const problems = pgTable(
  "problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    statement: text("statement").notNull(),
    solution: text("solution"),
    hint: text("hint"),
    explanation: text("explanation"),
    difficulty: integer("difficulty").notNull().default(1),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id),
    textbookId: uuid("textbook_id").references(() => textbooks.id),
    chapter: varchar("chapter", { length: 40 }),
    problemRef: varchar("problem_ref", { length: 40 }),
    pageRef: varchar("page_ref", { length: 20 }),
    submittedBy: uuid("submitted_by").references(() => users.id),
    attribution: text("attribution"),
    isOriginal: boolean("is_original").notNull().default(false),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    solutionType: varchar("solution_type", { length: 20 }).notNull().default("exact"),
    tags: text("tags").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("problems_slug_idx").on(t.slug),
    index("problems_subject_idx").on(t.subjectId),
    index("problems_textbook_idx").on(t.textbookId),
    index("problems_difficulty_idx").on(t.difficulty),
    index("problems_status_idx").on(t.status),
  ]
);

export const problemSolutions = pgTable("problem_solutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  problemId: uuid("problem_id")
    .notNull()
    .references(() => problems.id, { onDelete: "cascade" }),
  solution: text("solution").notNull(),
  note: text("note"),
});

// ============================================================
// PATHS
// ============================================================

export const paths = pgTable(
  "paths",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    description: text("description"),
    textbookId: uuid("textbook_id").references(() => textbooks.id),
    subjectId: uuid("subject_id").references(() => subjects.id),
    difficulty: integer("difficulty").notNull().default(2),
    coverUrl: text("cover_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("paths_slug_idx").on(t.slug)]
);

export const pathProblems = pgTable(
  "path_problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pathId: uuid("path_id")
      .notNull()
      .references(() => paths.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id),
    position: integer("position").notNull(),
    synopsis: text("synopsis"),
    pageStart: varchar("page_start", { length: 20 }),
    pageEnd: varchar("page_end", { length: 20 }),
  },
  (t) => [
    uniqueIndex("path_problems_unique_idx").on(t.pathId, t.problemId),
    uniqueIndex("path_problems_position_idx").on(t.pathId, t.position),
  ]
);

// ============================================================
// ROADMAPS
// ============================================================

export const roadmaps = pgTable(
  "roadmaps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    description: text("description"),
    coverUrl: text("cover_url"),
    createdBy: uuid("created_by").references(() => users.id),
    isOfficial: boolean("is_official").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("roadmaps_slug_idx").on(t.slug)]
);

export const roadmapStages = pgTable(
  "roadmap_stages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roadmapId: uuid("roadmap_id")
      .notNull()
      .references(() => roadmaps.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    position: integer("position").notNull(),
  },
  (t) => [uniqueIndex("roadmap_stages_position_idx").on(t.roadmapId, t.position)]
);

export const roadmapStageItems = pgTable(
  "roadmap_stage_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stageId: uuid("stage_id")
      .notNull()
      .references(() => roadmapStages.id, { onDelete: "cascade" }),
    itemType: varchar("item_type", { length: 20 }).notNull(),
    itemId: uuid("item_id").notNull(),
    position: integer("position").notNull(),
  },
  (t) => [uniqueIndex("roadmap_stage_items_position_idx").on(t.stageId, t.position)]
);

// ============================================================
// COLLECTIONS
// ============================================================

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    description: text("description"),
    coverUrl: text("cover_url"),
    createdBy: uuid("created_by").references(() => users.id),
    isOfficial: boolean("is_official").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("collections_slug_idx").on(t.slug)]
);

export const collectionProblems = pgTable(
  "collection_problems",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id),
    position: integer("position").notNull(),
  },
  (t) => [
    uniqueIndex("collection_problems_unique_idx").on(t.collectionId, t.problemId),
    uniqueIndex("collection_problems_position_idx").on(t.collectionId, t.position),
  ]
);

// ============================================================
// PROGRESS TRACKING
// ============================================================

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id),
    solved: boolean("solved").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    usedHint: boolean("used_hint").notNull().default(false),
    bestTimeMs: integer("best_time_ms"),
    xpEarned: integer("xp_earned").notNull().default(0),
    solvedAt: timestamp("solved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("user_progress_unique_idx").on(t.userId, t.problemId),
    index("user_progress_user_idx").on(t.userId),
    index("user_progress_solved_idx").on(t.userId, t.solved),
  ]
);

export const gameSessions = pgTable("game_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mode: varchar("mode", { length: 20 }).notNull(),
  contextType: varchar("context_type", { length: 20 }),
  contextId: uuid("context_id"),
  score: integer("score").notNull().default(0),
  problemsSolved: integer("problems_solved").notNull().default(0),
  durationMs: integer("duration_ms"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

// ============================================================
// ARITHMETIC
// ============================================================

export const arithmeticSessions = pgTable(
  "arithmetic_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: varchar("mode", { length: 20 }).notNull(),
    category: varchar("category", { length: 40 }).notNull(),
    submode: varchar("submode", { length: 20 }),
    star: integer("star"),
    customConfig: jsonb("custom_config"),
    seed: integer("seed").notNull(),
    durationSeconds: integer("duration_seconds"),
    score: integer("score").notNull().default(0),
    totalAttempts: integer("total_attempts").notNull().default(0),
    correctAttempts: integer("correct_attempts").notNull().default(0),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("arithmetic_sessions_user_idx").on(t.userId),
    index("arithmetic_sessions_category_idx").on(t.category),
    index("arithmetic_sessions_started_idx").on(t.startedAt),
  ]
);

export const arithmeticAttempts = pgTable(
  "arithmetic_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => arithmeticSessions.id, { onDelete: "cascade" }),
    generatedPrompt: jsonb("generated_prompt").notNull(),
    displayExpression: text("display_expression").notNull(),
    canonicalAnswer: varchar("canonical_answer", { length: 120 }).notNull(),
    userAnswer: varchar("user_answer", { length: 120 }).notNull(),
    correct: boolean("correct").notNull(),
    elapsedMs: integer("elapsed_ms").notNull(),
    scoreDelta: integer("score_delta").notNull().default(0),
    category: varchar("category", { length: 40 }).notNull(),
    submode: varchar("submode", { length: 20 }),
    star: integer("star"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("arithmetic_attempts_session_idx").on(t.sessionId),
    index("arithmetic_attempts_category_idx").on(t.category),
    index("arithmetic_attempts_created_idx").on(t.createdAt),
  ]
);

// ============================================================
// LEADERBOARD
// ============================================================

export const leaderboardEntries = pgTable(
  "leaderboard_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    displayName: varchar("display_name", { length: 40 }).notNull(),
    score: integer("score").notNull(),
    contextType: varchar("context_type", { length: 20 }).notNull().default("global"),
    contextId: uuid("context_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leaderboard_score_idx").on(t.score),
    index("leaderboard_context_idx").on(t.contextType, t.contextId),
  ]
);

// ============================================================
// FORUM
// ============================================================

export const forumCategories = pgTable(
  "forum_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 60 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    displayOrder: integer("display_order").notNull().default(0),
  },
  (t) => [uniqueIndex("forum_categories_slug_idx").on(t.slug)]
);

export const forumThreads = pgTable(
  "forum_threads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => forumCategories.id),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    title: varchar("title", { length: 300 }).notNull(),
    body: text("body").notNull(),
    isPinned: boolean("is_pinned").notNull().default(false),
    isLocked: boolean("is_locked").notNull().default(false),
    viewCount: integer("view_count").notNull().default(0),
    replyCount: integer("reply_count").notNull().default(0),
    lastReplyAt: timestamp("last_reply_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("forum_threads_category_idx").on(t.categoryId)]
);

export const forumReplies = pgTable(
  "forum_replies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => forumThreads.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    body: text("body").notNull(),
    parentId: uuid("parent_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("forum_replies_thread_idx").on(t.threadId)]
);

// ============================================================
// AI / BYOK
// ============================================================

export const userApiKeys = pgTable(
  "user_api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 40 }).notNull(),
    encryptedKey: text("encrypted_key").notNull(),
    keyHint: varchar("key_hint", { length: 10 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("user_api_keys_unique_idx").on(t.userId, t.provider)]
);

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  sessions: many(gameSessions),
  arithmeticSessions: many(arithmeticSessions),
  submittedProblems: many(problems),
  apiKeys: many(userApiKeys),
  threads: many(forumThreads),
  replies: many(forumReplies),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  problems: many(problems),
}));

export const textbooksRelations = relations(textbooks, ({ many }) => ({
  problems: many(problems),
  paths: many(paths),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [problems.subjectId],
    references: [subjects.id],
  }),
  textbook: one(textbooks, {
    fields: [problems.textbookId],
    references: [textbooks.id],
  }),
  submitter: one(users, {
    fields: [problems.submittedBy],
    references: [users.id],
  }),
  altSolutions: many(problemSolutions),
  progress: many(userProgress),
}));

export const problemSolutionsRelations = relations(problemSolutions, ({ one }) => ({
  problem: one(problems, {
    fields: [problemSolutions.problemId],
    references: [problems.id],
  }),
}));

export const pathsRelations = relations(paths, ({ one, many }) => ({
  textbook: one(textbooks, {
    fields: [paths.textbookId],
    references: [textbooks.id],
  }),
  subject: one(subjects, {
    fields: [paths.subjectId],
    references: [subjects.id],
  }),
  problems: many(pathProblems),
}));

export const pathProblemsRelations = relations(pathProblems, ({ one }) => ({
  path: one(paths, {
    fields: [pathProblems.pathId],
    references: [paths.id],
  }),
  problem: one(problems, {
    fields: [pathProblems.problemId],
    references: [problems.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  creator: one(users, {
    fields: [collections.createdBy],
    references: [users.id],
  }),
  problems: many(collectionProblems),
}));

export const collectionProblemsRelations = relations(collectionProblems, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionProblems.collectionId],
    references: [collections.id],
  }),
  problem: one(problems, {
    fields: [collectionProblems.problemId],
    references: [problems.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [userProgress.problemId],
    references: [problems.id],
  }),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
}));

export const arithmeticSessionsRelations = relations(
  arithmeticSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [arithmeticSessions.userId],
      references: [users.id],
    }),
    attempts: many(arithmeticAttempts),
  })
);

export const arithmeticAttemptsRelations = relations(arithmeticAttempts, ({ one }) => ({
  session: one(arithmeticSessions, {
    fields: [arithmeticAttempts.sessionId],
    references: [arithmeticSessions.id],
  }),
}));

export const forumThreadsRelations = relations(forumThreads, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumThreads.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, {
    fields: [forumThreads.authorId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  thread: one(forumThreads, {
    fields: [forumReplies.threadId],
    references: [forumThreads.id],
  }),
  author: one(users, {
    fields: [forumReplies.authorId],
    references: [users.id],
  }),
}));

export const userApiKeysRelations = relations(userApiKeys, ({ one }) => ({
  user: one(users, {
    fields: [userApiKeys.userId],
    references: [users.id],
  }),
}));
