import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import {
  createErrorResponse,
  handleValidationError,
  validateSignUp,
} from "../../../utils";

const prisma = new PrismaClient();

const validateSignIn = (email: string, password: string) => {
  const errors = [];

  if (!email || !password) {
    errors.push("invalidCredentials");
  }

  return errors;
};

export const signUp = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const errors = validateSignUp(email, password, username);
  if (errors.length > 0) {
    return res.status(400).json(handleValidationError(errors));
  }

  try {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });

    const existingErrors = [];
    if (emailExists) {
      existingErrors.push(createErrorResponse("emailTaken", "email"));
    }
    if (usernameExists) {
      existingErrors.push(createErrorResponse("usernameTaken", "username"));
    }

    if (existingErrors.length > 0) {
      return res.status(400).json(existingErrors);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: "USER",
      },
    });

    const token = generateToken(user.id, user.role);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json([createErrorResponse("internalServerError", "general")]);
  }
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
