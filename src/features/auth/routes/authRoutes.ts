import { Router } from "express";
import {
  signUp,
  signIn,
  deleteUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers";
import {
  authenticateToken,
  authorizeUserOrAdmin,
} from "../../../middleware/authMiddleware";

const router = Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.delete(
  "/delete/:userId",
  authenticateToken,
  authorizeUserOrAdmin,
  deleteUser
);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
