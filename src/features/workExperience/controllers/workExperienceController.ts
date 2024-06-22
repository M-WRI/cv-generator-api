import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequest extends Request {
  user?: { userId: number; role: string };
}

export const createWorkExperiences = async (req: IRequest, res: Response) => {
  const workExperiences = req.body;
  const userId = req.user?.userId;

  if (!Array.isArray(workExperiences)) {
    return res
      .status(400)
      .json({ error: "Payload should be an array of work experience records" });
  }

  try {
    const workExperienceRecords = workExperiences.map((workExperience) => ({
      ...workExperience,
      userId: userId!,
    }));

    const createdWorkExperiences = await prisma.workExperience.createMany({
      data: workExperienceRecords,
    });

    res.status(201).json({ count: createdWorkExperiences.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkExperiences = async (req: IRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const workExperiences = await prisma.workExperience.findMany({
      where: { userId: userId! },
    });

    res.status(200).json(workExperiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWorkExperience = async (req: IRequest, res: Response) => {
  const workExperienceId = parseInt(req.params.workExperienceId, 10);

  try {
    const workExperience = await prisma.workExperience.findUnique({
      where: { id: workExperienceId },
    });

    if (!workExperience) {
      return res.status(404).json({ error: "Work experience not found" });
    }

    res.status(200).json(workExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteWorkExperience = async (req: IRequest, res: Response) => {
  const workExperienceId = parseInt(req.params.workExperienceId, 10);

  try {
    await prisma.workExperience.delete({
      where: { id: workExperienceId },
    });

    res.status(200).json({ message: "Work experience successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
