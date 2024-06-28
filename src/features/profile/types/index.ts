import { User } from "../../auth/types";
import { CV } from "../../cv/types";

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
  profileSummary?: string | null;
  userId: number;
  user: User;
  cvs?: CV[];
}
