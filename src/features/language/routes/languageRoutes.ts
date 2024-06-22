import { Router } from "express";
import {
  createLanguages,
  getLanguages,
  getLanguage,
  deleteLanguage,
} from "../controllers/languageController";
import { authenticateToken } from "../../../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createLanguages);
router.get("/", authenticateToken, getLanguages);
router.get("/:languageId", authenticateToken, getLanguage);
router.delete("/:languageId", authenticateToken, deleteLanguage);

export default router;
