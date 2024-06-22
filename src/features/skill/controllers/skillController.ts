import { IRequest } from '../../../types/express';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSkills = async (req: IRequest, res: Response) => {
  const skills = req.body;
  const userId = req.user?.userId;

  if (!Array.isArray(skills)) {
    return res
      .status(400)
      .json({ error: 'Payload should be an array of skill records' });
  }

  try {
    const skillRecords = skills.map(skill => ({
      ...skill,
      userId: userId!,
    }));

    const createdSkills = await prisma.skill.createMany({
      data: skillRecords,
    });

    res.status(201).json({ count: createdSkills.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSkills = async (req: IRequest, res: Response) => {
  const userId = req.user?.userId;

  try {
    const skills = await prisma.skill.findMany({
      where: { userId: userId! },
    });

    res.status(200).json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSkill = async (req: IRequest, res: Response) => {
  const skillId = parseInt(req.params.skillId, 10);

  try {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    res.status(200).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSkill = async (req: IRequest, res: Response) => {
  const skillId = parseInt(req.params.skillId, 10);

  try {
    await prisma.skill.delete({
      where: { id: skillId },
    });

    res.status(200).json({ message: 'Skill successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
