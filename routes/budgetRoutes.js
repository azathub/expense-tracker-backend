import { Router } from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";
import { protect } from "../middleware/auth.js";

const router = Router();


router.post("/", protect, createBudget);
router.get("/", protect, getBudgets);
router.patch("/:id", protect, updateBudget);
router.delete("/:id", protect, deleteBudget);

export default router;
