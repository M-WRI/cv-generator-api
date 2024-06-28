import { User } from "../../auth/types";
import { CV } from "../../cv/types";

export interface Education {
  id: number;
  degree: string;
  school: string;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  additionalInfo?: string | null;
  userId: number;
  user: User;
  cvs?: CV[];
}
