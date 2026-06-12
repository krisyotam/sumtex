import type { InferSelectModel } from "drizzle-orm";
import type {
  users,
  subjects,
  textbooks,
  problems,
  paths,
  roadmaps,
  collections,
  userProgress,
  gameSessions,
  leaderboardEntries,
  forumCategories,
  forumThreads,
  forumReplies,
  userApiKeys,
} from "@/lib/db/schema";

export type User = InferSelectModel<typeof users>;
export type Subject = InferSelectModel<typeof subjects>;
export type Textbook = InferSelectModel<typeof textbooks>;
export type Problem = InferSelectModel<typeof problems>;
export type Path = InferSelectModel<typeof paths>;
export type Roadmap = InferSelectModel<typeof roadmaps>;
export type Collection = InferSelectModel<typeof collections>;
export type UserProgress = InferSelectModel<typeof userProgress>;
export type GameSession = InferSelectModel<typeof gameSessions>;
export type LeaderboardEntry = InferSelectModel<typeof leaderboardEntries>;
export type ForumCategory = InferSelectModel<typeof forumCategories>;
export type ForumThread = InferSelectModel<typeof forumThreads>;
export type ForumReply = InferSelectModel<typeof forumReplies>;
export type UserApiKey = InferSelectModel<typeof userApiKeys>;
