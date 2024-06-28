import { User } from "../../auth/types";
import { CV } from "../../cv/types";

export interface Language {
  id: number;
  language: string;
  languageLevel: number;
  userId: number;
  user: User;
  cvs?: CV[];
}
