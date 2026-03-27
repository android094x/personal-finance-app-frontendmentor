import { z } from "zod";

// --- Base pagination (reusable for any paginated endpoint) ---

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().gte(1).default(1),
  limit: z.coerce.number().gte(1).lte(100).default(10),
});

export const PaginationResponseSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginationResponse = z.infer<typeof PaginationResponseSchema>;
