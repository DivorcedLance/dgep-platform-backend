# new_idiomas_doc_type

id                    //INT
name                  //VARCHAR(100)

```
1 DNI
2 Carnet de Extranjeria
3 Pasaporte
4 Tarjeta de Residencia
```

# countries

id                    //INT
name                  //VARCHAR(100)

```
9101 Argelia
...
9233 Peru
9234 Bolivia
...
9508 República De Fiyi
(solo mete 10 datos)
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

# new_idiomas_role

id                    //INT
name                  //VARCHAR(100)

```
1 Coordinador
2 Docente
3 Programador
4 Asesor
5 Asistente
6 Estudiante
7 Consultor de certificados
```

# new_idiomas_user

id                    //INT
person_id             //INT
password              //VARCHAR(100)
role_id               //INT
is_active             //BOOLEAN

# new_idiomas_teacher_state

id                    //INT
name                  //VARCHAR(100)

```
1 Activo
2 Inactivo 
```

# new_idiomas_teacher

id                    //INT
user_id               //INT
state_id              //INT

# new_idiomas_teacher_language

teacher_id            //INT
language_id           //INT

# new_idiomas_postgraduate_permanency

id                    //INT
name                  //VARCHAR(100)

```
1 Activo
2 Egresado
3 Reserva de ingreso
4 Inactivo
5 Abandono
```

# new_idiomas_faculty

id                    //INT
name                  //VARCHAR(100)

```
1 Medicina
2 Derecho y ciencias politicas
...
```

# new_idiomas_postgraduate_program

id                    //INT
name                  //VARCHAR(100)

```
201 Segunda Especialidad en Medicina Humana
202 Segunda Especialidad en Enfermería
...
```

# new_idiomas_student_state

id                    //INT
name                  //VARCHAR(100)

```
1 Activo
2 Inactivo 
```

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

# new_idiomas_language

id                    //INT
name                  //VARCHAR(100)

```
1 Inglés
2 Portugués
3 Italiano
4 Francés
5 Quechua
6 Aymara
```

# new_idiomas_program

id                    //INT
name                  //VARCHAR(100)

```
1 Regular
2 Repaso
3 Intensivo
```

# new_idiomas_level

id                    //INT
name                  //VARCHAR(100)

```
1 Básico
2 Intermedio
3 Avanzado
```

# new_idiomas_day

id                    //INT
name                  //VARCHAR(100)

```
1 Lunes
2 Martes
3 Miércoles
4 Jueves
5 Viernes
6 Sábado
7 Domingo
```

# new_idiomas_section

id                    //INT
name                  //VARCHAR(100)

```
1 A
2 B
3 C
```

# new_idiomas_max_cycle_per_language_level

language_id          //INT
level_id             //INT
max_cycle            //INT

# new_idiomas_courses_state

id                    //INT
name                  //VARCHAR(100)

```
1 En matrícula
2 En curso
3 Inhabilitado
4 Cerrado
5 En matrícula interna
```

# new_idiomas_course

id
program_id            //INT
language_id           //INT
level_id              //INT or NULL
cycle                 //INT or NULL
section_id            //INT or NULL
start_date            //DATE
end_date              //DATE
session_number        //INT
state_id              //INT
teacher_id            //INT
enrolled_limit        //INT
created_by            //INT

# new_idiomas_course_schedule

course_id             //INT
day_id                //INT
start_hour            //VARCHAR(5)
end_hour              //VARCHAR(5)

# new_idiomas_payment_method

id                    //INT
name                  //VARCHAR(100)

```
1 Agentes BCP
2 Yape
3 Banca Móvil
```

# new_idiomas_payment_state

id                    //INT
name                  //VARCHAR(100)

```
1 En revisión
2 Aprobado
3 Rechazado
```

# new_idiomas_payment

id                    //INT
operation_number      //VARCHAR(100)
payment_method_id     //INT
payment_date          //TIMESTAMP
amount                //FLOAT
payment_state_id      //INT

# new_idiomas_enrollment_request_state

id                    //INT
name                  //VARCHAR(100)

```
1 Pendiente
2 Aprobada
3 Rechazada
4 Rezagada
```

# new_idiomas_course_enrollment_request

id                      //INT
student_id              //INT or NULL
course_id               //INT
payment_id              //INT
request_date            //TIMESTAMP
new_student_request_id  //INT
is_new_student          //BOOLEAN
state_id                //INT

# new_idiomas_course_student_state

id                    //INT
name                  //VARCHAR(100)

```
1 Matriculado
2 Alumno libre
3 Rezagado
4 Retirado
```	

# new_idiomas_course_student

course_id             //INT
student_id            //INT
state_id              //INT

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

# new_idiomas_straggle_state

id                    //INT
name                  //VARCHAR(100)

```
1 Pendiente
2 Completada
```

# new_idiomas_course_straggle_request

id                    //INT
prev_course_id        //INT
student_id            //INT
state_id              //INT
post_course_id        //INT or NULL
request_date          //TIMESTAMP
created_by            //INT

# new_idiomas_exam_modality

id                    //INT
name                  //VARCHAR(100)

```
1 Ordinario
2 Extraordinario
```

# new_idiomas_exam_state

id                    //INT
name                  //VARCHAR(100)

```
1 En Inscripción
2 En Curso
3 Inhabilitado
4 Finalizado
```

# new_idiomas_exam

id                     //INT
exam_modality_id       //INT
language_id            //INT
evaluation_jury_ids    //INT[]
overseer_jury_ids      //INT[]
date                   //TIMESTAMP
start_hour             //VARCHAR(5)
end_hour               //VARCHAR(5)
state_id               //INT
enrollment_limit       //INT
enrolled_limit         //INT
created_by             //INT

# new_idiomas_exam_enrollment_request

id                      //INT
student_id              //INT
exam_id                 //INT
payment_id              //INT
request_date            //TIMESTAMP
new_student_request_id  //INT
is_new_student          //BOOLEAN
state_id                //INT

# new_idiomas_exam_student_state

id                    //INT
name                  //VARCHAR(100)

```
1 Inscrito
2 Rezagado
3 Retirado
```

# new_idiomas_exam_student

exam_id               //INT
student_id            //INT
state_id              //INT

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

# new_idiomas_proficiency_request_state

id                    //INT
name                  //VARCHAR(100)

```
1 Pendiente
2 Aprobada
3 Rechazada
```

# new_idiomas_proficiency_request

id                    //INT
student_id            //INT
language_id           //INT
level_id              //INT
payment_id            //INT
request_date          //TIMESTAMP
state_id              //INT