import { Faculty } from "./faculty";

export type StudentState = {
  id: number;
  name: string;
}

export type PostgraduatePermanency = {
  id: number;
  name: string;
}

export type PostgraduateProgram = {
  id: number;
  name: string;
}

export type StudentData = {
  id: number;
  studentCode: string;
  postgraduatePermanency: PostgraduatePermanency;
  faculty: Faculty;
  postgraduateProgram: PostgraduateProgram;
  postgraduateEnrollmentCount: number;
  postgraduateAdmissionYear: number;
  state: StudentState;
}

export type StudentDataCreate = {
  studentCode: string;
  postgraduatePermanencyId: number;
  facultyId: number;
  postgraduateProgramId: number;
  postgraduateEnrollmentCount: number;
  postgraduateAdmissionYear: number;
  stateId: number;
}