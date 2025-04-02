export type StudentStatus = {
  id: number;
  name: string;
}

export type PostgraduatePermanency = {
  id: number;
  name: string;
}

export type Faculty = {
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
  status: StudentStatus;
}

export type StudentDataCreate = {
  studentCode: string;
  postgraduatePermanencyId: number;
  facultyId: number;
  postgraduateProgramId: number;
  postgraduateEnrollmentCount: number;
  postgraduateAdmissionYear: number;
  statusId: number;
}