import { DocType } from "./docType";
import { Role } from "./role";
import { TeacherState } from "./teacherState";
import { Language } from "./language";
import { StudentState } from "./studentState";
import { Country } from "./country";
import { Faculty } from "./faculty";
import { Program } from "./program";
import { Level } from "./level";
import { TeacherUser } from "./user";
import { Section } from "./section";
import { Day } from "./day";
import { PostgraduatePermanency, PostgraduateProgram } from "./student";

export type UserDetails = {
  docTypes: DocType[];
  roles: Role[];
  teacherStates: TeacherState[];
  languages: Language[];
  studentStates: StudentState[];
  countries: Country[];
  faculties: Faculty[];
  postgraduatePrograms: Record<number, PostgraduateProgram[]>;
  postgraduatePermanencies: PostgraduatePermanency[];
};

export type MaxCyclePerLanguageLevel = {
  languageId: number;
  levelId: number;
  maxCycle: number;
}

export type CourseDetails = {
  programs: Program[];
  languages: Language[];
  levels: Level[];
  sections: Section[];
  days: Day[];
  maxCyclePerLanguageLevel: MaxCyclePerLanguageLevel[];
  activeTeachers: TeacherUser[];
  courseStates: CourseState[];
}

export type NewStudentRequestDetails = {
  docTypes: DocType[];
  countries: Country[];
  faculties: Faculty[];
  postgraduatePrograms: PostgraduateProgram[];
  postgraduatePermanencies: PostgraduatePermanency[];
};