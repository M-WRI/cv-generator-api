import { Response, NextFunction } from "express";
import { IRequest } from "../types/express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticateToken = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    if (typeof user === "string") {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

export const authorizeUserOrAdmin = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.userId, 10);
  const { user } = req;

  if (user && (user.role === "ADMIN" || user.userId === userId)) {
    next();
  } else {
    res
      .status(403)
      .json({ error: "You are not authorized to perform this action" });
  }
};
