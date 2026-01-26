import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Chat messages table for storing conversation history
 * Note: User preferences and history are stored in LocalStorage on frontend
 * This table is for analytics and improvement purposes only
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  season: mysqlEnum("season", ["spring", "summer", "fall", "winter"]),
  budgetTier: varchar("budgetTier", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Bag recommendations table for caching and analytics
 */
export const bagRecommendations = mysqlTable("bag_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  bagName: varchar("bagName", { length: 255 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  price: int("price").notNull(),
  season: mysqlEnum("season", ["spring", "summer", "fall", "winter"]).notNull(),
  budgetTier: varchar("budgetTier", { length: 20 }).notNull(),
  whyCool: text("whyCool").notNull(),
  stylingGuide: text("stylingGuide").notNull(),
  purchaseLink: text("purchaseLink"),
  imageUrl: text("imageUrl"),
  celebrityInspo: json("celebrityInspo").$type<string[]>(),
  isBlacklisted: int("isBlacklisted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BagRecommendation = typeof bagRecommendations.$inferSelect;
export type InsertBagRecommendation = typeof bagRecommendations.$inferInsert;
