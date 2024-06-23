import { Request, Response } from "express";
import { createErrorResponse } from "../../../utils";
import { prisma } from "../../../prismaClient";

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return res
        .status(400)
        .json(createErrorResponse("invalidVerificationToken", "general"));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, verificationToken: null },
    });

    res.status(200).json({ message: "Account verified, you can now log in" });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("internalServerError", "general"));
  }
};
