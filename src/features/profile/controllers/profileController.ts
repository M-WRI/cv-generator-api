import { IRequest } from "../../../types/express";
import { Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProfile = async (req: IRequest, res: Response) => {
  const { firstName, lastName, profileImage, profileSummary } = req.body;
  const userId = req.user?.userId;

  try {
    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        profileImage,
        profileSummary,
        userId: userId!,
      },
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfiles = async (req: IRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const profiles = await prisma.profile.findMany({
      where: { userId: userId! },
    });

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile = async (req: IRequest, res: Response) => {
  const profileId = parseInt(req.params.profileId, 10);

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProfile = async (req: IRequest, res: Response) => {
  const profileId = parseInt(req.params.profileId, 10);

  try {
    await prisma.profile.delete({
      where: { id: profileId },
    });

    res.status(200).json({ message: "Profile successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
