import { CourseDetails, MaxCyclePerLanguageLevel } from "@/lib/db/types/details";
import { getProgram } from "./program";
import { getLanguage } from "./language";
import { getLevel } from "./level";
import { Program } from "./types/program";
import { Language } from "./types/language";
import { Level } from "./types/level";
import { Section } from "./types/section";
import { Day } from "./types/day";
import { TeacherUser } from "./types/user";
import { CourseState } from "./types/course";
import { getSection } from "./section";
import { getDay } from "./day";
import { db } from "./db";
import { getActiveTeachers } from "./teacher";
import { coursesStateTable, maxCyclePerLanguageLevelTable } from "./tables";

export async function getCourseState(): Promise<CourseState[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${coursesStateTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}

export async function getMaxCyclePerLanguageLevel(): Promise<MaxCyclePerLanguageLevel[]> {
  const result = await db.execute({
    sql: `
      SELECT language_id, level_id, max_cycle
      FROM ${maxCyclePerLanguageLevelTable}
    `,
  });

  return result.rows.map((row) => ({
    languageId: row.language_id as number,
    levelId: row.level_id as number,
    maxCycle: row.max_cycle as number,
  }));
}

export async function getCourseDetails(): Promise<CourseDetails> {
  const [ programs, languages, levels, sections, days, maxCyclePerLanguageLevel, activeTeachers, courseStates ] = await Promise.all([
    getProgram(),
    getLanguage(),
    getLevel(),
    getSection(),
    getDay(),
    getMaxCyclePerLanguageLevel(),
    getActiveTeachers(),
    getCourseState(),
  ]);

  return {
    programs: programs as Program[],
    languages: languages as Language[],
    levels: levels as Level[],
    sections: sections as Section[],
    days: days as Day[],
    maxCyclePerLanguageLevel: maxCyclePerLanguageLevel as MaxCyclePerLanguageLevel[],
    activeTeachers: activeTeachers as TeacherUser[],
    courseStates: courseStates as CourseState[],
  };
}