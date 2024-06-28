import { CV, CVListRequest, CVListResponse } from "../types";

export const cvListSerializer = (cvs: CVListRequest[]): CVListResponse[] => {
  return cvs.map((cv: CV) => ({
    id: cv.id,
    title: cv.title,
  }));
};
