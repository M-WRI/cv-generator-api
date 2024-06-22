import { prisma } from "../../../prismaClient";
import sgMail from "@sendgrid/mail";
import { Request, Response } from "express";
import {
  createErrorResponse,
  handleValidationError,
  validateSignUp,
} from "../../../utils";
import { hashPassword } from "../utils/hash";
import crypto from "crypto";

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

    const existingErrors: any = [];
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
