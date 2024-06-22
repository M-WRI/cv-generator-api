import { Request, Response } from "express";
import { createErrorResponse, handleValidationError } from "../../../utils";
import { comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validateSignIn = (email: string, password: string): string[] => {
  const errors: string[] = [];

  if (!email || !password) {
    errors.push("invalidCredentials");
  }

  return errors;
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errors = validateSignIn(email, password);
  if (errors.length > 0) {
    return res.status(400).json(handleValidationError(errors));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json([createErrorResponse("invalidCredentials", "general")]);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json([createErrorResponse("invalidCredentials", "general")]);
    }

    const token = generateToken(user.id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json([createErrorResponse("internalServerError", "general")]);
  }
};
