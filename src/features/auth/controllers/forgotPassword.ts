import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { createErrorResponse } from "../../../utils";
import { Request, Response } from "express";

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

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
