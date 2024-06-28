import { User } from "../../auth/types";
import { CV } from "../../cv/types";

export interface WorkExperience {
  id: number;
  companyName: string;
  position: string;
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  workDescription?: string | null;
  userId: number;
  user: User;
  cvs?: CV[];
}
