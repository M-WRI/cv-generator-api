import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createErrorResponse } from "../../../utils";

const prisma = new PrismaClient();

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json([createErrorResponse("internalServerError", "general")]);
  }
};
