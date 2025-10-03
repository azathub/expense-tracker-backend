import { Router } from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.patch("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;
