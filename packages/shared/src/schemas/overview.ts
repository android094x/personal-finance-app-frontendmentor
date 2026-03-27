import { z } from "zod";
import { TransactionWithCategorySchema } from "./transaction";

export const BalanceSummarySchema = z.object({
  current: z.string(),
  income: z.string(),
  expenses: z.string(),
});

export const BudgetSummarySchema = z.object({
  id: z.string(),
  maximum: z.string(),
  theme: z.string(),
  categoryName: z.string(),
  spent: z.string(),
});

export const PotSummaryItemSchema = z.object({
  name: z.string(),
  total: z.string(),
  target: z.string(),
  theme: z.string(),
});

export const PotsSummarySchema = z.object({
  totalSaved: z.string(),
  items: z.array(PotSummaryItemSchema),
});

export const RecurringBillsSummarySchema = z.object({
  paid: z.string(),
  upcoming: z.string(),
  dueSoon: z.string(),
});

export const OverviewResponseSchema = z.object({
  balance: BalanceSummarySchema,
  budgets: z.array(BudgetSummarySchema),
  pots: PotsSummarySchema,
  recurringBills: RecurringBillsSummarySchema,
  transactions: z.array(TransactionWithCategorySchema),
});

export type BalanceSummary = z.infer<typeof BalanceSummarySchema>;
export type BudgetSummary = z.infer<typeof BudgetSummarySchema>;
export type PotSummaryItem = z.infer<typeof PotSummaryItemSchema>;
export type PotsSummary = z.infer<typeof PotsSummarySchema>;
export type RecurringBillsSummary = z.infer<typeof RecurringBillsSummarySchema>;
export type OverviewResponse = z.infer<typeof OverviewResponseSchema>;
