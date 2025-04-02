export type CourseEnrollmentRequestCreate = {
  courseId: number
  studentId: number
  paymentId: number

  newStudentRequestId: number
  isNewStudent: boolean

  stateId: number
}