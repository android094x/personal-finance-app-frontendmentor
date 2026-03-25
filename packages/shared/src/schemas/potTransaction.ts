import { z } from "zod";

export const PotTransactionSchema = z.object({
  id: z.uuid(),
  potId: z.uuid(),
  type: z.enum(["deposit", "withdrawal"]),
  amount: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreatePotTransactionSchema = PotTransactionSchema.omit({
  id: true,
  potId: true,
  createdAt: true,
  updatedAt: true,
});

export type PotTransaction = z.infer<typeof PotTransactionSchema>;
export type CreatePotTransaction = z.infer<typeof CreatePotTransactionSchema>;
