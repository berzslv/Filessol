import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by").references(() => users.referralCode),
  walletBalance: numeric("wallet_balance", { precision: 18, scale: 0 }).default("0"),
});

export const staking = pgTable("staking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: numeric("amount", { precision: 18, scale: 0 }).notNull(),
  startDate: timestamp("start_date").notNull().defaultNow(),
  unlockDate: timestamp("unlock_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'buy', 'sell', 'stake', 'unstake', 'reward'
  amount: numeric("amount", { precision: 18, scale: 0 }).notNull(),
  fee: numeric("fee", { precision: 18, scale: 0 }),
  referralBonus: numeric("referral_bonus", { precision: 18, scale: 0 }),
  date: timestamp("date").notNull().defaultNow(),
  transactionHash: text("transaction_hash"),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id).notNull(),
  referredId: integer("referred_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  rewardAmount: numeric("reward_amount", { precision: 18, scale: 0 }),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'referral' or 'staking'
  period: text("period").notNull(), // 'weekly' or 'monthly'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  data: jsonb("data").notNull(), // Array of top users with their stats
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  referralCode: true,
  referredBy: true,
  walletBalance: true,
});

export const insertStakingSchema = createInsertSchema(staking).pick({
  userId: true,
  amount: true,
  startDate: true,
  unlockDate: true,
  isActive: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  fee: true,
  referralBonus: true,
  transactionHash: true,
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  referrerId: true,
  referredId: true,
  rewardAmount: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).pick({
  type: true,
  period: true,
  startDate: true,
  endDate: true,
  data: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStaking = z.infer<typeof insertStakingSchema>;
export type Staking = typeof staking.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;
export type Leaderboard = typeof leaderboard.$inferSelect;

// Additional types for the application
export type LeaderboardUser = {
  id: number;
  walletAddress: string;
  displayAddress: string;
  value: number;
  bonus?: string;
  percentage?: number;
};

export type LeaderboardData = {
  weekly: {
    referrers: LeaderboardUser[];
    stakers: LeaderboardUser[];
  };
  monthly: {
    referrers: LeaderboardUser[];
    stakers: LeaderboardUser[];
  };
};
