import { z } from "zod";

export const BillStatusSchema = z.enum(["paid", "upcoming", "due-soon"]);

export const RecurringBillSchema = z.object({
  id: z.string(),
  avatar: z.string().nullable(),
  name: z.string(),
  amount: z.string(),
  date: z.coerce.date(),
  status: BillStatusSchema,
});

export const RecurringBillsSummaryDetailSchema = z.object({
  count: z.number(),
  total: z.string(),
});

export const RecurringBillsResponseSchema = z.object({
  bills: z.array(RecurringBillSchema),
  summary: z.object({
    paid: RecurringBillsSummaryDetailSchema,
    upcoming: RecurringBillsSummaryDetailSchema,
    dueSoon: RecurringBillsSummaryDetailSchema,
  }),
  totalAmount: z.string(),
});

export const RecurringBillsSortSchema = z.enum([
  "latest",
  "oldest",
  "a-z",
  "z-a",
  "highest",
  "lowest",
]);

export const RecurringBillsQuerySchema = z.object({
  search: z.string().optional(),
  sort: RecurringBillsSortSchema.default("latest"),
});

export type BillStatus = z.infer<typeof BillStatusSchema>;
export type RecurringBill = z.infer<typeof RecurringBillSchema>;
export type RecurringBillsResponse = z.infer<typeof RecurringBillsResponseSchema>;
export type RecurringBillsSort = z.infer<typeof RecurringBillsSortSchema>;
export type RecurringBillsQuery = z.infer<typeof RecurringBillsQuerySchema>;
