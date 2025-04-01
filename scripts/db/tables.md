# new_idiomas_document_type

id                    //INT
name                  //VARCHAR(100)

```
a. DNI
b. Carnet de Extranjeria
c. Pasaporte
d. Tarjeta de Residencia
```

# new_idiomas_person

id                    //INT
doc_num               //VARCHAR(20)
doc_type_id           //INT
names                 //VARCHAR(100)
father_last_name      //VARCHAR(100)
mother_last_name      //VARCHAR(100)
nationality_id        //INT
phone                 //VARCHAR(20)
personal_email        //VARCHAR(100)
gender                //VARCHAR(1)
birthDate             //DATE

# new_idiomas_user

id                    //INT
person_id             //INT
password              //VARCHAR(100)
role_id               //INT
is_active             //BOOLEAN

# new_idiomas_role

id                    //INT
name                  //VARCHAR(100)

```
a. Coordinador 
b. Docente 
c. Programador 
d. Asesor 
e. Asistente
f. Estudiante
e. Consultor de certificados
```

# new_idiomas_teacher

id                    //INT
user_id               //INT
state_id              //INT

# new_idiomas_teacher_state

id                    //INT
name                  //VARCHAR(100)

```
a. Activo
b. Inactivo 
```

# new_idiomas_teacher_language

teacher_id            //INT
language_id           //INT

# new_idiomas_student

id                             //INT
user_id                        //INT
student_code                   //VARCHAR(20)
postgraduate_permanency_id     //INT
faculty_id                     //INT
postgraduate_program_id        //INT
postgraduate_enrollment_count  //INT
postgraduate_admission_year    //INT
state_id                       //INT

# new_idiomas_student_state

id                    //INT
name                  //VARCHAR(100)

```
a. Activo
b. Inactivo 
```

# new_idiomas_faculty

id                    //INT
name                  //VARCHAR(100)

```
a. 1 - Medicina
b. 2 - Derecho y ciencias politicas
```

# new_idiomas_postgraduate_program

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_postgraduate_permanency

id                    //INT
name                  //VARCHAR(100)

# countries

id                    //INT
name                  //VARCHAR(100)

```
a. 9233 - Peru
b. 9234 - Bolivia
```

# new_idiomas_language

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_program

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_level

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_day

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_section

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_max_cycle_per_language_level

language_id          //INT
level_id             //INT
max_cycle            //INT

# new_idiomas_courses_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_course

id
program_id            //INT
language_id           //INT
level_id              //INT or NULL
cycle                 //INT or NULL
section_id            //INT or NULL
start_date            //DATE
end_date              //DATE
state_id              //INT
teacher_id            //INT
enrolled_limit        //INT
created_by            //INT

# new_idiomas_course_schedule

course_id             //INT
day_id                //INT
start_hour            //VARCHAR(5)
end_hour              //VARCHAR(5)

# new_idiomas_payment

id                    //INT
operation_number      //VARCHAR(100)
payment_method_id     //INT
payment_date          //TIMESTAMP
amount                //FLOAT
payment_state_id      //INT

# new_idiomas_payment_method

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_payment_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_course_enrollment_request

id                      //INT
student_id              //INT or NULL
course_id               //INT
payment_id              //INT
request_date            //TIMESTAMP
new_student_request_id  //INT
is_new_student          //BOOLEAN
state_id                //INT

# new_idiomas_enrollment_request_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_course_student

course_id             //INT
student_id            //INT
state_id              //INT

# new_idiomas_course_student_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_course_student_score

course_id             //INT
student_id            //INT
score1                //INT or NULL
score2                //INT or NULL
score3                //INT or NULL
score4                //INT or NULL
average_score         //INT or NULL

# new_idiomas_course_student_assistance

<!-- TODO PENDIENTE -->

# new_idiomas_course_straggle_request

id                    //INT
prev_course_id        //INT
student_id            //INT
state_id              //INT
post_course_id        //INT or NULL
request_date          //TIMESTAMP
created_by            //INT

# new_idiomas_straggle_request_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_exam

id                     //INT
examModality_id        //INT
language_id            //INT
evaluation_jury_ids    //INT[]
overseer_jury_ids      //INT[]
date                   //TIMESTAMP
start_hour             //TIMESTAMP
end_hour               //TIMESTAMP
state_id               //INT
enrollment_limit       //INT
enrolled_limit         //INT
created_by             //INT

# new_idiomas_exam_modality

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_exam_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_exam_enrollment_request

id                      //INT
student_id              //INT
exam_id                 //INT
payment_id              //INT
request_date            //TIMESTAMP
new_student_request_id  //INT
is_new_student          //BOOLEAN
state_id                //INT

# new_idiomas_exam_enrollment_request_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_exam_student

exam_id               //INT
student_id            //INT
state_id              //INT

# new_idiomas_exam_student_state

id                    //INT
name                  //VARCHAR(100)

# new_idiomas_exam_student_score

exam_id               //INT
student_id            //INT
score                 //INT or NULL

# new_idiomas_exam_straggle_request

id                    //INT
prev_exam_id          //INT
student_id            //INT
state_id              //INT
post_exam_id          //INT or NULL
request_date          //TIMESTAMP
created_by            //INT

# new_idiomas_proficiency_request

id                    //INT
student_id            //INT
language_id           //INT
level_id              //INT
payment_id            //INT
request_date          //TIMESTAMP
state_id              //INT

# new_idiomas_proficiency_request_state

id                    //INT
name                  //VARCHAR(100)