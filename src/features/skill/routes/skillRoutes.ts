import { Router } from "express";
import {
  createSkills,
  getSkills,
  getSkill,
  deleteSkill,
} from "../controllers/skillController";
import { authenticateToken } from "../../../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createSkills);
router.get("/", authenticateToken, getSkills);
router.get("/:skillId", authenticateToken, getSkill);
router.delete("/:skillId", authenticateToken, deleteSkill);

export default router;
