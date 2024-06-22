import { Request } from "express";

export interface IRequest extends Request {
  user?: JwtPayload & { userId: number; role: Role };
}
