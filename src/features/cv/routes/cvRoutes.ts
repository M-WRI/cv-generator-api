import { Router } from "express";
import { createCV, getCVs, getCV, deleteCV } from "../controllers/cvController";
import { authenticateToken } from "../../../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createCV);
router.get("/", authenticateToken, getCVs);
router.get("/:cvId", authenticateToken, getCV);
router.delete("/:cvId", authenticateToken, deleteCV);

export default router;
