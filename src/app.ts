import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./features/auth/routes/authRoutes";
import profileRoutes from "./features/profile/routes/profileRoutes";
import educationRoutes from "./features/education/routes/educationRoutes";
import skillRoutes from "./features/skill/routes/skillRoutes";
import languageRoutes from "./features/language/routes/languageRoutes";
import workExperienceRoutes from "./features/workExperience/routes/workExperienceRoutes";
import cvRoutes from "./features/cv/routes/cvRoutes";

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/educations", educationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/work-experiences", workExperienceRoutes);
app.use("/api/cvs", cvRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
