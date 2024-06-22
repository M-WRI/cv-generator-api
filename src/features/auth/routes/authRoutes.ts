import { Router } from "express";
import { signUp, signIn, deleteUser } from "../controllers/authController";
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

export default router;
