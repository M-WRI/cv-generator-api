import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";
import {
  createErrorResponse,
  handleValidationError,
  validateSignUp,
} from "../../../utils";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

const prisma = new PrismaClient();

const validateSignIn = (email: string, password: string) => {
  const errors = [];

  if (!email || !password) {
    errors.push("invalidCredentials");
  }

  return errors;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

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

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: "USER",
        verificationToken,
      },
    });

    const msg = {
      to: email,
      from: {
        email: process.env.EMAIL_FROM!,
      },
      subject: "Account Verification",
      text: `Click the following link to verify your account: http://localhost:8000/api/auth/verify/${verificationToken}`,
      html: `<strong>Click the following link to verify your account:</strong> <a href="http://localhost:8000/api/auth/verify/${verificationToken}">Verify</a>`,
    };

    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        res.status(201).json({
          message:
            "User registered, please check your email to verify your account",
          token: user,
        });
      })
      .catch((error) => {
        console.error("Error sending email:", error.response.body.errors);
        res.status(500).json({ message: "Error sending email" });
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json([createErrorResponse("internalServerError", "general")]);
  }
};

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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    const msg = {
      to: email,
      from: {
        email: process.env.EMAIL_FROM!,
        name: "Your Service Name",
      },
      subject: "Password Reset",
      text: `You requested a password reset. Please click the following link to reset your password: http://localhost:8000/api/auth/reset-password/${resetToken}`,
      html: `<strong>You requested a password reset. Please click the following link to reset your password:</strong> <a href="http://localhost:8000/api/auth/reset-password/${resetToken}">Reset Password</a>`,
    };

    await sgMail
      .send(msg)
      .then(() => {
        res.status(200).json({ message: "Password reset email sent" });
      })
      .catch((error) => {
        console.error(
          "Error sending email:",
          error.response ? error.response.body.errors : error
        );
        res
          .status(500)
          .json(createErrorResponse("emailSendingError", "general"));
      });
  } catch (error) {
    res.status(500).json(createErrorResponse("internalServerError", "general"));
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json(createErrorResponse("expiredResetPasswordToken", "general"));
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json(createErrorResponse("internalServerError", "general"));
  }
};
