import { z } from "zod";

export const PotSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  target: z.string(),
  total: z.string(),
  theme: z.string().min(1),
  createdAt: z.date(),
});

export const CreatePotSchema = PotSchema.omit({
  id: true,
  total: true,
  createdAt: true,
});

export const UpdatePotSchema = CreatePotSchema.partial();

export type Pot = z.infer<typeof PotSchema>;
export type CreatePot = z.infer<typeof CreatePotSchema>;
export type UpdatePot = z.infer<typeof UpdatePotSchema>;
