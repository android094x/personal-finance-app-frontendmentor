import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  uuid,
} from "drizzle-orm/pg-core";

// Keep in sync with @finance/shared
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  avatar: text("avatar"),
  name: text("name").notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  recurring: boolean("recurring").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  category: text("category").notNull().unique(),
  maximum: numeric("maximum", { precision: 10, scale: 2 }).notNull(),
  theme: text("theme").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pots = pgTable("pots", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  target: numeric("target", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).default("0").notNull(),
  theme: text("theme").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
