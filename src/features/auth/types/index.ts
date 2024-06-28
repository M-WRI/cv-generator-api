import { CV } from "../../cv/types";
import { Education } from "../../education/types";
import { Language } from "../../language/types";
import { Profile } from "../../profile/types";
import { Skill } from "../../skill/types";
import { WorkExperience } from "../../workExperience/types";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  email: string;
  password: string;
  username: string;
  role: Role;
  verified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  profiles?: Profile[];
  educations?: Education[];
  skills?: Skill[];
  languages?: Language[];
  workExperiences?: WorkExperience[];
  cvs?: CV[];
}
