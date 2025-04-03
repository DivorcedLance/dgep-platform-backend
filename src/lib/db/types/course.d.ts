import { Day } from "./day"
import { Section } from "./section"
import { TeacherUser } from "./user"

export type CourseCreate = {
  programId: number
  languageId: number
  levelId: number | undefined
  cycle: number | undefined
  scheduleDayIds: number[]
  scheduleHours: {
    start: string
    end: string
  }[]
  sectionId: number
  startDate: string
  endDate: string
  teacherId: number
  stateId: number
}

export type DaySchedule = {
  day: Day
  start: string
  end: string
}

export type CourseState = {
  id: number
  name: string
}

export type Course = {
  id: number
  program: Program
  language: Language
  level?: Level
  cycle?: number
  schedule: DaySchedule[]
  section: Section
  startDate: Date
  endDate: Date
  teacher: TeacherUser
  state: CourseState
  enrollmentCount?: number
}