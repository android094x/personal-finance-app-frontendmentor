import { Router } from "express";
import { z } from "zod";

import { getOverview } from "@/controllers/overview.controller";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", getOverview);

export default router;
