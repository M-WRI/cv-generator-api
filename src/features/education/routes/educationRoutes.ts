import { Router } from "express";
import {
  createEducation,
  getEducations,
  getEducation,
  deleteEducation,
} from "../controllers/educationController";
import { authenticateToken } from "../../../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createEducation);
router.get("/", authenticateToken, getEducations);
router.get("/:educationId", authenticateToken, getEducation);
router.delete("/:educationId", authenticateToken, deleteEducation);

export default router;
