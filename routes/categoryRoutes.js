import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createCategory);
router.get("/", protect, getCategories);
router.patch("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;
