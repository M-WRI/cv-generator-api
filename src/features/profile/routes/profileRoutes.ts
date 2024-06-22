import { Router } from "express";
import {
  createProfile,
  getProfiles,
  getProfile,
  deleteProfile,
} from "../controllers/profileController";
import { authenticateToken } from "../../../middleware/authMiddleware";

const router = Router();

router.post("/", authenticateToken, createProfile);
router.get("/", authenticateToken, getProfiles);
router.get("/:profileId", authenticateToken, getProfile);
router.delete("/:profileId", authenticateToken, deleteProfile);

export default router;
