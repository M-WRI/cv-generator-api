import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { IRequest } from "../../../types/express";

const prisma = new PrismaClient();

export const createLanguages = async (req: IRequest, res: Response) => {
  const languages = req.body;
  const userId = req.user?.userId;

  if (!Array.isArray(languages)) {
    return res
      .status(400)
      .json({ error: "Payload should be an array of language records" });
  }

  try {
    const languageRecords = languages.map((language) => ({
      ...language,
      userId: userId!,
    }));

    const createdLanguages = await prisma.language.createMany({
      data: languageRecords,
    });

    res.status(201).json({ count: createdLanguages.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLanguages = async (req: IRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const languages = await prisma.language.findMany({
      where: { userId: userId! },
    });

    res.status(200).json(languages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLanguage = async (req: IRequest, res: Response) => {
  const languageId = parseInt(req.params.languageId, 10);

  try {
    const language = await prisma.language.findUnique({
      where: { id: languageId },
    });

    if (!language) {
      return res.status(404).json({ error: "Language not found" });
    }

    res.status(200).json(language);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteLanguage = async (req: IRequest, res: Response) => {
  const languageId = parseInt(req.params.languageId, 10);

  try {
    await prisma.language.delete({
      where: { id: languageId },
    });

    res.status(200).json({ message: "Language successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
