import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IRequest } from "../../../types/express";

const prisma = new PrismaClient();

export const createEducation = async (req: IRequest, res: Response) => {
  const educations = req.body;
  const userId = req.user?.userId;

  if (!Array.isArray(educations)) {
    return res
      .status(400)
      .json({ error: "Payload should be an array of education records" });
  }

  try {
    const educationRecords = educations.map((education) => ({
      ...education,
      userId: userId!,
    }));

    const createdEducations = await prisma.education.createMany({
      data: educationRecords,
    });

    res.status(201).json({ count: createdEducations.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEducations = async (req: IRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const educations = await prisma.education.findMany({
      where: { userId: userId! },
    });

    res.status(200).json(educations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getEducation = async (req: IRequest, res: Response) => {
  const educationId = parseInt(req.params.educationId, 10);

  try {
    const education = await prisma.education.findUnique({
      where: { id: educationId },
    });

    if (!education) {
      return res.status(404).json({ error: "Education not found" });
    }

    res.status(200).json(education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEducation = async (req: IRequest, res: Response) => {
  const educationId = parseInt(req.params.educationId, 10);

  try {
    await prisma.education.delete({
      where: { id: educationId },
    });

    res.status(200).json({ message: "Education successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
