import db from "@/db";
import { budgets, categories, pots, transactions } from "@/db/schema";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";

export const getBalance = async (userId: string) => {
  const [balance] = await db
    .select({
      current: sql<string>`COALESCE(SUM(${transactions.amount}), '0')`,
      income: sql<string>`COALESCE(SUM(CASE WHEN ${transactions.amount} > 0 THEN ${transactions.amount} ELSE 0 END), '0')`,
      expenses: sql<string>`COALESCE(ABS(SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)), '0')`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  return balance;
};

export const getBudgetsSummary = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return db
    .select({
      id: budgets.id,
      maximum: budgets.maximum,
      theme: budgets.theme,
      categoryName: categories.name,
      spent: sql<string>`COALESCE(ABS(SUM(${transactions.amount})), '0')`,
    })
    .from(budgets)
    .leftJoin(categories, eq(categories.id, budgets.categoryId))
    .leftJoin(
      transactions,
      and(
        eq(transactions.categoryId, budgets.categoryId),
        eq(transactions.userId, budgets.userId),
        gte(transactions.date, startOfMonth),
        lt(transactions.date, startOfNextMonth),
      ),
    )
    .where(eq(budgets.userId, userId))
    .groupBy(budgets.id, budgets.maximum, budgets.theme, categories.name);
};

export const getPotsSummary = async (userId: string) => {
  const [totals] = await db
    .select({
      totalSaved: sql<string>`COALESCE(SUM(${pots.total}), '0')`,
    })
    .from(pots)
    .where(eq(pots.userId, userId));

  const items = await db
    .select({
      name: pots.name,
      total: pots.total,
      target: pots.target,
      theme: pots.theme,
    })
    .from(pots)
    .where(eq(pots.userId, userId));

  return { totalSaved: totals.totalSaved, items };
};

export const getRecurringBillsSummary = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Get the latest transaction date to calculate "due soon" (within 5 days)
  const [latestTx] = await db
    .select({ maxDate: sql<string>`MAX(${transactions.date})` })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  const latestDate = latestTx?.maxDate ? new Date(latestTx.maxDate) : now;
  const dueSoonCutoff = new Date(latestDate);
  dueSoonCutoff.setDate(dueSoonCutoff.getDate() + 5);

  // All recurring transactions this month
  const recurringThisMonth = await db
    .select({
      name: transactions.name,
      amount: transactions.amount,
      date: transactions.date,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.recurring, true),
        gte(transactions.date, startOfMonth),
        lt(transactions.date, startOfNextMonth),
      ),
    )
    .orderBy(desc(transactions.date));

  let paid = 0;
  let upcoming = 0;
  let dueSoon = 0;

  for (const bill of recurringThisMonth) {
    const amount = Math.abs(Number(bill.amount));
    const billDate = new Date(bill.date);

    if (billDate <= latestDate) {
      paid += amount;
    } else {
      upcoming += amount;
      if (billDate <= dueSoonCutoff) {
        dueSoon += amount;
      }
    }
  }

  return {
    paid: paid.toFixed(2),
    upcoming: upcoming.toFixed(2),
    dueSoon: dueSoon.toFixed(2),
  };
};

export const getLatestTransactions = async (userId: string) => {
  return db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    with: {
      category: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: desc(transactions.date),
    limit: 5,
  });
};

export const getOverview = async (userId: string) => {
  const [balance, budgetsSummary, potsSummary, recurringBills, latestTransactions] =
    await Promise.all([
      getBalance(userId),
      getBudgetsSummary(userId),
      getPotsSummary(userId),
      getRecurringBillsSummary(userId),
      getLatestTransactions(userId),
    ]);

  return {
    balance,
    budgets: budgetsSummary,
    pots: potsSummary,
    recurringBills,
    transactions: latestTransactions,
  };
};
