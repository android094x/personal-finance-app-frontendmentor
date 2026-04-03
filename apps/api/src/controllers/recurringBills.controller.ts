import type { Response } from "express";

import type { RecurringBillsQuery } from "@finance/shared";

import type { AuthenticatedRequest } from "@/middleware/auth";
import * as recurringBillsService from "@/services/recurringBills.service";

export const getRecurringBills = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.user!.id;
  const query = req.query as unknown as RecurringBillsQuery;

  const result = await recurringBillsService.getAll(userId, {
    search: query.search,
    sort: query.sort ?? "latest",
  });

  res.json({ data: result });
};
