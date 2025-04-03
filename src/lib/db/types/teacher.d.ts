import { Language } from "./language";

export type TeacherState = {
  id: number;
  name: string;
}

export type TeacherData = {
  id: number;
  state: TeacherState;
  specializedLanguages: Language[];
}

export type TeacherDataCreate = {
  stateId: number;
  specializedLanguageIds: number[];
}