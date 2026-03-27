import { z } from "zod";

export const PotTransactionSchema = z.object({
  id: z.uuid(),
  potId: z.uuid(),
  type: z.enum(["deposit", "withdraw"]),
  amount: z.string(),
  createdAt: z.coerce.date(),
});

export const CreatePotTransactionSchema = PotTransactionSchema.omit({
  id: true,
  potId: true,
  createdAt: true,
});

export const PotTransactionAmountSchema = z.object({
  amount: z.string(),
});

export type PotTransaction = z.infer<typeof PotTransactionSchema>;
export type CreatePotTransaction = z.infer<typeof CreatePotTransactionSchema>;
export type PotTransactionAmount = z.infer<typeof PotTransactionAmountSchema>;
