// routes/authRoutes.js
import { Router } from "express";
import {
  registerUser,
  loginUser,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/account", protect, deleteAccount);

export default router;
