import { Language } from "./language";

export type TeacherStatus = {
  id: number;
  name: string;
}

export type TeacherData = {
  id: number;
  status: TeacherStatus;
  specializedLanguages: Language[];
}

export type TeacherDataCreate = {
  statusId: number;
  specializedLanguageIds: number[];
}