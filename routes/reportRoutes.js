import { Router } from "express";
import {
  getTotalSpentByCategory,
  getWalletBalance,
  getMonthlyExpenseSummary,
  getBudgetsLimitByCategory,
} from "../controllers/reportController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/totalSpent/byCategory", protect, getTotalSpentByCategory);
router.get("/budgets/categoryLimit", protect, getBudgetsLimitByCategory);
router.get("/wallets/balances", protect, getWalletBalance);
router.get("/expenses/monthlySummary", protect, getMonthlyExpenseSummary);

export default router;
