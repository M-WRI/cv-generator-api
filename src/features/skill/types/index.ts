import { User } from "../../auth/types";
import { CV } from "../../cv/types";

export interface Skill {
  id: number;
  skillName: string;
  skillLevel: number;
  userId: number;
  user: User;
  cvs?: CV[];
}
