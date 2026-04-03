import { and, asc, desc, eq, gte, ilike, lt, sql } from "drizzle-orm";

import type {
  BillStatus,
  RecurringBillsQuery,
  RecurringBillsSort,
} from "@finance/shared";

import db from "@/db";
import { transactions } from "@/db/schema";

export const getAll = async (userId: string, options: RecurringBillsQuery) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // Get the latest transaction date to determine paid vs upcoming
  const [latestTx] = await db
    .select({ maxDate: sql<string>`MAX(${transactions.date})` })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  const latestDate = latestTx?.maxDate ? new Date(latestTx.maxDate) : now;
  const dueSoonCutoff = new Date(latestDate);
  dueSoonCutoff.setDate(dueSoonCutoff.getDate() + 5);

  // Base conditions (no search filter — used for all bills)
  const baseConditions = [
    eq(transactions.userId, userId),
    eq(transactions.recurring, true),
    gte(transactions.date, startOfMonth),
    lt(transactions.date, startOfNextMonth),
  ];

  // Sort mapping
  const ORDER_BY: Record<RecurringBillsSort, ReturnType<typeof desc>> = {
    latest: desc(transactions.date),
    oldest: asc(transactions.date),
    "a-z": asc(transactions.name),
    "z-a": desc(transactions.name),
    highest: desc(transactions.amount),
    lowest: asc(transactions.amount),
  };

  // Fetch all recurring bills (unfiltered) for summary
  const allRows = await db
    .select({
      id: transactions.id,
      avatar: transactions.avatar,
      name: transactions.name,
      amount: transactions.amount,
      date: transactions.date,
    })
    .from(transactions)
    .where(and(...baseConditions))
    .orderBy(ORDER_BY[options.sort]);

  // Classify each bill and compute summary
  const summary = {
    paid: { count: 0, total: 0 },
    upcoming: { count: 0, total: 0 },
    dueSoon: { count: 0, total: 0 },
  };
  let totalAmount = 0;

  const classifyBill = (row: (typeof allRows)[number]) => {
    const amount = Math.abs(Number(row.amount));
    const billDate = new Date(row.date);

    let status: BillStatus;
    if (billDate <= latestDate) {
      status = "paid";
    } else if (billDate <= dueSoonCutoff) {
      status = "due-soon";
    } else {
      status = "upcoming";
    }

    return { ...row, status, _amount: amount };
  };

  const allBills = allRows.map(classifyBill);

  for (const bill of allBills) {
    totalAmount += bill._amount;
    if (bill.status === "paid") {
      summary.paid.count++;
      summary.paid.total += bill._amount;
    } else if (bill.status === "due-soon") {
      summary.upcoming.count++;
      summary.upcoming.total += bill._amount;
      summary.dueSoon.count++;
      summary.dueSoon.total += bill._amount;
    } else {
      summary.upcoming.count++;
      summary.upcoming.total += bill._amount;
    }
  }

  // Apply search filter for the returned bills list
  const searchLower = options.search?.toLowerCase();
  const bills = allBills
    .filter((b) => !searchLower || b.name.toLowerCase().includes(searchLower))
    .map(({ _amount, ...bill }) => bill);

  return {
    bills,
    summary: {
      paid: {
        count: summary.paid.count,
        total: summary.paid.total.toFixed(2),
      },
      upcoming: {
        count: summary.upcoming.count,
        total: summary.upcoming.total.toFixed(2),
      },
      dueSoon: {
        count: summary.dueSoon.count,
        total: summary.dueSoon.total.toFixed(2),
      },
    },
    totalAmount: totalAmount.toFixed(2),
  };
};
