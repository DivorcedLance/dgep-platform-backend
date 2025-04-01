# Person

Person
{
  docNum                  //string
  -docTypeId              //int (DocType)
  names                   //string
  fatherLastName          //string
  motherLastName          //string
  -nationalityId          //int (Country)
  phone                   //string
  personalEmail           //string
  gender                  //string
  birthDate               //timestamp
}

# User

User
{
  personId                //int (Person)

  email                   //string
  password                //string
  -roleId                 //int (Role)
  isActive                //bool
}

DocType
{
  docTypeName             //string
}
```
a. DNI
b. Carnet de Extranjeria
c. Pasaporte
d. Tarjeta de Residencia
```

Role
{
  roleName                //string
}
```
a. Coordinador 
b. Docente 
c. Programador 
d. Asesor 
e. Asistente
f. Estudiante
```

Teacher
{
  -userId                  //int (User)

  -stateId                 //int (TeacherState)
}

TeacherState
{
  stateName                //string
}
```
a. Activo
b. Inactivo 
```

TeacherSpecializedLanguage
{
  -teacherId               //int (Teacher o User por decidir)
  -languageId              //int (Language)
}

Student
{
  -userId                  //int (User)
  studentCode              //string
  -stateId                 //int (StudentState)
}

StudentState
{
  stateName                //string
}
```
a. Activo
b. Inactivo 
```

Country
{
  countryName             //string
}
```
...
```

Faculty
{
  facultyName             //string
}
```
...
```

# Course

Course
{
  -programId              //int (Program)
  -languageId             //int (Language)
  -levelId                //int or null (Level)
  cycle                   //int or null

  -sectionId              //int or null (Section)
  startDate               //timestamp
  endDate                 //timestamp

  -teacherId              //int (Teacher o User por decidir)

  enrollmentLimit         //int
  -stateId                //int (CourseState)
  createdBy               //int (userId)
}

CourseState
{
  stateName               //string
}
```
a. En matrícula
b. En curso
c. Inhabilitado
d. Cerrado
e. En matrícula interna
```

Program
{
  programName             //string
}
```
a. Regular
b. Repaso
c. Intensivo
```

Language
{
  languageName            //string
}
```
a. Inglés
b. Portugués
c. Italiano
d. Francés
e. Quechua
f. Aymara
```

Level
{
  levelName               //string
}
```
a. Básico
b. Intermedio
c. Avanzado.
```

MaxCyclePerLanguageLevel
{
  -languageId             //int (Language)
  -levelId                //int (Level)
  maxCycle                //int
}

Section
{
  sectionName             //string
}

```
a. A
b. B
c. C
```

CourseSchedule
{
  -courseId               //int (Course)
  -dayId                  //int (Day)
  startHour               //timestamp
  endHour                 //timestamp
}

Day
{
  dayName                 //string
}
```
a. Lunes
b. Martes
c. Miércoles
d. Jueves
e. Viernes
f. Sábado
g. Domingo
```

Payment
{
  operationNumber         //string
  -paymentMethodId        //int (PaymentMethod)
  paymentDate             //timestamp
  amount                  //float
  -paymentStateId         //int (PaymentState)
}

PaymentState
{
  stateName               //string
}
```
a. En revisión
b. Aprobado
c. Rechazado
```

PaymentMethod
{
  methodName              //string
}
```
a. AgentesBCP
b. Yape
c. Banca Móvil
```

CourseEnrollmentRequest
{
  -courseId               //int (Course)
  -studentId              //int (User o Student por decidir)
  -paymentId              //int (Payment)
  
  requestDate             //timestamp
  isNewStudent            //bool
  -stateId                //int (EnrollmentRequestState)
}

EnrollmentRequestState
{
  stateName               //string
}
```
a. Pendiente
b. Aprobada
c. Rechazada
d. Rezagada
```

CourseStudent
{
  -courseId               //int (Course)
  -studentId              //int (User o Student por decidir)
  -stateId                //int (CourseStudentState)
}

CourseStudentState
{
  stateName               //string
}
```
a. Matriculado
b. AlumnoLibre
c. Rezagado
d. Retirado
```	

CourseStudentScore
{
  -courseId               //int (Course)
  -studentId              //int (User o Student por decidir)
  score1                  //int or null
  score2                  //int or null
  score3                  //int or null
  score4                  //int or null

  averageScore            //int or null
}

CourseStraggleRequest
{
  -prevCourseId           //int (Course)
  -studentId              //int (User o Student por decidir)
  -stateId                //int (StraggleRequestState)
  -postCourseId           //string or null (Course)
  requestDate             //timestamp
  -createdBy              //int (User)
}

StraggleRequestState
{
  stateName               //string
}
```
a. Pendiente
b. Completada
```

# Exam

Exam
{
  -examModalityId         //int (ExamModality)
  -languageId             //int (Language)
  -evaluationJuryIds      //string[] (User)
  -overseerJuryIds        //string[] (User)
  date                    //timestamp
  startHour               //timestamp
  endHour                 //timestamp
  -stateId                //int (ExamState)
  enrollmentLimit         //int
  createdBy               //int (userId)
}

ExamModality
{
  modalityName            //string
}
```
a. Ordinario
b. Extraordinario
```

ExamState
{
  stateName               //string
}
```
a. En Inscripción
b. En Curso
c. Inhabilitado
d. Finalizado
```

ExamEnrollmentRequest
{
  -examId                 //int (Exam)
  -studentId              //int (User o Student por decidir)
  -paymentId              //int (Payment)
  requestDate             //timestamp
  isNewStudent            //bool
  -stateId                //int (EnrollmentRequestState)
}

ExamStudent
{
  -examId                 //int (Exam)
  -studentId              //int (User o Student por decidir)
  -stateId                //int (ExamStudentState)
}

ExamStudentState
{
  stateName               //string
}
```
a. Inscrito
b. Rezagado
c. Retirado
```

ExamStudentScore
{
  -examId                 //int (Exam)
  -studentId              //int (User o Student por decidir)
  score                   //int or null
}

ExamStraggleRequest
{
  -prevExamId             //int (Exam)
  -studentId              //int (User o Student por decidir)
  -stateId                //int (StraggleRequestState)
  -postExamId             //string or null (Exam)
  requestDate             //timestamp
  createdBy               //int (User)
}

# Proficiency

ProficiencyRequest
{
  -studentId              //int (User o Student por decidir)
  -languageId             //int (Language)
  -levelId                //int (Level)
  -paymentId              //int (Payment)

  -stateId                //int (ProficiencyRequestState)
  requestDate             //timestamp
}

ProficiencyRequestState
{
  stateName               //string
}

```
a. Pendiente
b. Aprobada
c. Rechazada
```