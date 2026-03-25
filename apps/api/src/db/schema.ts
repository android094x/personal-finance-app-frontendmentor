import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  unique,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

// TODO Keep in sync with @finance/shared

export const potType = pgEnum("pot_type", ["deposit", "withdrawal"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 50 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.name)],
);

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  avatar: text("avatar"),
  name: text("name").notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  date: timestamp("date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  recurring: boolean("recurring").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  maximum: numeric("maximum", { precision: 10, scale: 2 }).notNull(),
  theme: text("theme").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pots = pgTable("pots", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  target: numeric("target", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).default("0").notNull(),
  theme: text("theme").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const potTransactions = pgTable("pot_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  potId: uuid("pot_id")
    .references(() => pots.id, { onDelete: "cascade" })
    .notNull(),
  type: potType("type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  transactions: many(transactions),
  budgets: many(budgets),
  pots: many(pots),
}));

export const txsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
  budgets: many(budgets),
}));

export const potsRelations = relations(pots, ({ one, many }) => ({
  user: one(users, {
    fields: [pots.userId],
    references: [users.id],
  }),
  potTransactions: many(potTransactions),
}));

export const potTransactionsRelations = relations(
  potTransactions,
  ({ one }) => ({
    pot: one(pots, {
      fields: [potTransactions.potId],
      references: [pots.id],
    }),
  }),
);
