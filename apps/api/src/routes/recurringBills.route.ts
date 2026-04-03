import { Router } from "express";

import { getRecurringBills } from "@/controllers/recurringBills.controller";
import { authenticateToken } from "@/middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", getRecurringBills);

export default router;
