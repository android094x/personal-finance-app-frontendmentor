import type { Response } from "express";

import * as overviewService from "@/services/overview.service";
import type { AuthenticatedRequest } from "@/middleware/auth";

export const getOverview = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const overview = await overviewService.getOverview(userId);

  res.json({ data: overview });
};
