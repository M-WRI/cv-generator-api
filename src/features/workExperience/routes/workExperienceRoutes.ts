import { Router } from "express";
import {
  createWorkExperiences,
  getWorkExperiences,
  getWorkExperience,
  deleteWorkExperience,
} from "../controllers/workExperienceController";
import { authenticateToken } from "../../../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createWorkExperiences);
router.get("/", authenticateToken, getWorkExperiences);
router.get("/:workExperienceId", authenticateToken, getWorkExperience);
router.delete("/:workExperienceId", authenticateToken, deleteWorkExperience);

export default router;
