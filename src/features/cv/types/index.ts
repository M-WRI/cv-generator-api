import { User } from "../../auth/types";
import { Education } from "../../education/types";
import { Language } from "../../language/types";
import { Profile } from "../../profile/types";
import { Skill } from "../../skill/types";
import { WorkExperience } from "../../workExperience/types";

export interface CV {
  id: number;
  title: string;
  userId: number;
  user?: User;
  profiles?: Profile[];
  educations?: Education[];
  skills?: Skill[];
  languages?: Language[];
  workExperiences?: WorkExperience[];
}

export interface CVListRequest {
  id: number;
  title: string;
  userId: number;
}

export interface CVListResponse {
  id: number;
  title: string;
}
