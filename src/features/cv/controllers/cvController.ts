import { IRequest } from "../../../types/express";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCV = async (req: IRequest, res: Response) => {
  const { title, profiles, educations, skills, languages, workExperiences } =
    req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID not provided" });
  }

  try {
    // Handle profiles separately since we need to create these manually
    const profileData = profiles?.map((profile: any) => ({
      firstName: profile.firstName,
      lastName: profile.lastName,
      profileImage: profile.profileImage,
      profileSummary: profile.profileSummary,
      userId: userId,
    }));

    // Handle educations
    const educationData = await Promise.all(
      educations?.map(async (education: any) => {
        const existingEducation = await prisma.education.findFirst({
          where: {
            degree: education.degree,
            school: education.school,
            startMonth: education.startMonth,
            startYear: education.startYear,
            userId: userId,
          },
        });
        if (existingEducation) {
          await prisma.education.update({
            where: { id: existingEducation.id },
            data: {
              endMonth: education.endMonth,
              endYear: education.endYear,
              additionalInfo: education.additionalInfo,
            },
          });
          return existingEducation;
        } else {
          return prisma.education.create({
            data: {
              ...education,
              userId: userId,
            },
          });
        }
      })
    );

    // Handle skills
    const skillData = await Promise.all(
      skills?.map(async (skill: any) => {
        const existingSkill = await prisma.skill.findFirst({
          where: {
            skillName: skill.skillName,
            userId: userId,
          },
        });
        if (existingSkill) {
          await prisma.skill.update({
            where: { id: existingSkill.id },
            data: {
              skillLevel: skill.skillLevel,
            },
          });
          return existingSkill;
        } else {
          return prisma.skill.create({
            data: {
              ...skill,
              userId: userId,
            },
          });
        }
      })
    );

    // Handle languages
    const languageData = await Promise.all(
      languages?.map(async (language: any) => {
        const existingLanguage = await prisma.language.findFirst({
          where: {
            language: language.language,
            userId: userId,
          },
        });
        if (existingLanguage) {
          await prisma.language.update({
            where: { id: existingLanguage.id },
            data: {
              languageLevel: language.languageLevel,
            },
          });
          return existingLanguage;
        } else {
          return prisma.language.create({
            data: {
              ...language,
              userId: userId,
            },
          });
        }
      })
    );

    // Handle work experiences
    const workExperienceData = await Promise.all(
      workExperiences?.map(async (workExperience: any) => {
        const existingWorkExperience = await prisma.workExperience.findFirst({
          where: {
            companyName: workExperience.companyName,
            position: workExperience.position,
            startMonth: workExperience.startMonth,
            startYear: workExperience.startYear,
            userId: userId,
          },
        });
        if (existingWorkExperience) {
          await prisma.workExperience.update({
            where: { id: existingWorkExperience.id },
            data: {
              endMonth: workExperience.endMonth,
              endYear: workExperience.endYear,
              workDescription: workExperience.workDescription,
            },
          });
          return existingWorkExperience;
        } else {
          return prisma.workExperience.create({
            data: {
              ...workExperience,
              userId: userId,
            },
          });
        }
      })
    );

    // Create CV with the processed data
    const cv = await prisma.cV.create({
      data: {
        title,
        userId,
        profiles: {
          create: profileData,
        },
        educations: {
          connect: educationData.map((education: any) => ({
            id: education.id,
          })),
        },
        skills: {
          connect: skillData.map((skill: any) => ({
            id: skill.id,
          })),
        },
        languages: {
          connect: languageData.map((language: any) => ({
            id: language.id,
          })),
        },
        workExperiences: {
          connect: workExperienceData.map((workExperience: any) => ({
            id: workExperience.id,
          })),
        },
      },
      include: {
        profiles: true,
        educations: true,
        skills: true,
        languages: true,
        workExperiences: true,
      },
    });

    res.status(201).json(cv);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCVs = async (req: IRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const cvs = await prisma.cV.findMany({
      where: { userId: userId! },
      include: {
        profiles: true,
        educations: true,
        skills: true,
        languages: true,
        workExperiences: true,
      },
    });

    res.status(200).json(cvs);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCV = async (req: IRequest, res: Response) => {
  const cvId = parseInt(req.params.cvId, 10);

  try {
    const cv = await prisma.cV.findUnique({
      where: { id: cvId },
      include: {
        profiles: true,
        educations: true,
        skills: true,
        languages: true,
        workExperiences: true,
      },
    });

    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }

    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCV = async (req: IRequest, res: Response) => {
  const cvId = parseInt(req.params.cvId, 10);

  try {
    await prisma.cV.delete({
      where: { id: cvId },
    });

    res.status(200).json({ message: "CV successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
