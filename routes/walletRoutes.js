import { Router } from "express";
import {
  createWallet,
  getWallets,
  updateWallet,
  deleteWallet,
} from "../controllers/walletController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createWallet);
router.get("/", protect, getWallets);
router.patch("/:id", protect, updateWallet);
router.post("/:id", protect, deleteWallet);

export default router;
