import type { Request, Response } from "express";

import * as overviewService from "@/services/overview.service";
import type { AuthenticatedRequest } from "@/middleware/auth";

export const getOverview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const overview = await overviewService.getOverview(userId);

    res.status(200).json({
      ...overview,
    });
  } catch (error) {
    console.error("Get overview error:", error);
    res.status(500).json({ error: "Failed to fetch overview info" });
  }
};
