-- Tabla: Tipo de documento
CREATE TABLE new_idiomas_document_type (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Países
CREATE TABLE countries (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Persona
CREATE TABLE new_idiomas_person (
    id INT PRIMARY KEY,
    doc_num VARCHAR(20),
    doc_type_id INT,
    names VARCHAR(100),
    father_last_name VARCHAR(100),
    mother_last_name VARCHAR(100),
    nationality_id INT,
    phone VARCHAR(20),
    personal_email VARCHAR(100),
    gender VARCHAR(1),
    birthDate DATE,
    FOREIGN KEY (doc_type_id) REFERENCES new_idiomas_document_type(id),
    FOREIGN KEY (nationality_id) REFERENCES countries(id)
);

-- Tabla: Roles de usuario
CREATE TABLE new_idiomas_role (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Usuario
CREATE TABLE new_idiomas_user (
    id INT PRIMARY KEY,
    person_id INT,
    password VARCHAR(100),
    role_id INT,
    is_active BOOLEAN,
    FOREIGN KEY (person_id) REFERENCES new_idiomas_person(id),
    FOREIGN KEY (role_id) REFERENCES new_idiomas_role(id)
);

-- Tabla: Estado del docente
CREATE TABLE new_idiomas_teacher_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Docente
CREATE TABLE new_idiomas_teacher (
    id INT PRIMARY KEY,
    user_id INT,
    state_id INT,
    FOREIGN KEY (user_id) REFERENCES new_idiomas_user(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_teacher_state(id)
);

-- Tabla intermedia: Idioma por docente
CREATE TABLE new_idiomas_teacher_language (
    teacher_id INT,
    language_id INT,
    PRIMARY KEY (teacher_id, language_id)
    -- Se podría agregar FK a tabla de idiomas si la tienes
);

-- Tabla: Permanencia de posgrado
CREATE TABLE new_idiomas_postgraduate_permanency (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Facultades
CREATE TABLE new_idiomas_faculty (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Programas de posgrado
CREATE TABLE new_idiomas_postgraduate_program (
    program_id INT,
    faculty_id INT,
    name VARCHAR(100)
    PRIMARY KEY (program_id, faculty_id)
);

-- Tabla: Estado del estudiante
CREATE TABLE new_idiomas_student_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Estudiantes
CREATE TABLE new_idiomas_student (
    id INT PRIMARY KEY,
    user_id INT,
    student_code VARCHAR(20),
    postgraduate_permanency_id INT,
    faculty_id INT,
    postgraduate_program_id INT,
    postgraduate_enrollment_count INT,
    postgraduate_admission_year INT,
    state_id INT,
    FOREIGN KEY (user_id) REFERENCES new_idiomas_user(id),
    FOREIGN KEY (postgraduate_permanency_id) REFERENCES new_idiomas_postgraduate_permanency(id),
    FOREIGN KEY (faculty_id) REFERENCES new_idiomas_faculty(id),
    FOREIGN KEY (postgraduate_program_id, faculty_id) REFERENCES new_idiomas_postgraduate_program(program_id, faculty_id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_student_state(id)
);

-- Tabla: Idiomas
CREATE TABLE new_idiomas_language (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Programas
CREATE TABLE new_idiomas_program (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Niveles
CREATE TABLE new_idiomas_level (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Días
CREATE TABLE new_idiomas_day (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Secciones
CREATE TABLE new_idiomas_section (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Máximo ciclo por nivel e idioma
CREATE TABLE new_idiomas_max_cycle_per_language_level (
    language_id INT,
    level_id INT,
    max_cycle INT,
    PRIMARY KEY (language_id, level_id),
    FOREIGN KEY (language_id) REFERENCES new_idiomas_language(id),
    FOREIGN KEY (level_id) REFERENCES new_idiomas_level(id)
);

-- Tabla: Estados del curso
CREATE TABLE new_idiomas_courses_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Curso
CREATE TABLE new_idiomas_course (
    id INT PRIMARY KEY,
    program_id INT,
    language_id INT,
    level_id INT,
    cycle INT,
    section_id INT,
    start_date DATE,
    end_date DATE,
    session_number INT,
    state_id INT,
    teacher_id INT,
    enrolled_limit INT,
    created_by INT,
    FOREIGN KEY (program_id) REFERENCES new_idiomas_program(id),
    FOREIGN KEY (language_id) REFERENCES new_idiomas_language(id),
    FOREIGN KEY (level_id) REFERENCES new_idiomas_level(id),
    FOREIGN KEY (section_id) REFERENCES new_idiomas_section(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_courses_state(id),
    FOREIGN KEY (teacher_id) REFERENCES new_idiomas_teacher(id),
    FOREIGN KEY (created_by) REFERENCES new_idiomas_user(id)
);

-- Tabla: Horario del curso
CREATE TABLE new_idiomas_course_schedule (
    course_id INT,
    day_id INT,
    start_hour VARCHAR(5),
    end_hour VARCHAR(5),
    PRIMARY KEY (course_id, day_id, start_hour),
    FOREIGN KEY (course_id) REFERENCES new_idiomas_course(id),
    FOREIGN KEY (day_id) REFERENCES new_idiomas_day(id)
);

-- Tabla: Métodos de pago
CREATE TABLE new_idiomas_payment_method (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Estados de pago
CREATE TABLE new_idiomas_payment_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Tabla: Pagos
CREATE TABLE new_idiomas_payment (
    id INT PRIMARY KEY,
    operation_number VARCHAR(100),
    payment_method_id INT,
    payment_date TIMESTAMP,
    amount FLOAT,
    payment_state_id INT,
    FOREIGN KEY (payment_method_id) REFERENCES new_idiomas_payment_method(id),
    FOREIGN KEY (payment_state_id) REFERENCES new_idiomas_payment_state(id)
);

-- Estado de solicitud de matrícula
CREATE TABLE new_idiomas_enrollment_request_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Solicitud de matrícula a curso
CREATE TABLE new_idiomas_course_enrollment_request (
    id INT PRIMARY KEY,
    student_id INT,
    course_id INT,
    payment_id INT,
    request_date TIMESTAMP,
    new_student_request_id INT,
    is_new_student BOOLEAN,
    state_id INT,
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (course_id) REFERENCES new_idiomas_course(id),
    FOREIGN KEY (payment_id) REFERENCES new_idiomas_payment(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_enrollment_request_state(id)
);

-- Estado del estudiante en curso
CREATE TABLE new_idiomas_course_student_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Asociación estudiante-curso
CREATE TABLE new_idiomas_course_student (
    course_id INT,
    student_id INT,
    state_id INT,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES new_idiomas_course(id),
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_course_student_state(id)
);

-- Notas del estudiante en curso
CREATE TABLE new_idiomas_course_student_score (
    course_id INT,
    student_id INT,
    score1 INT,
    score2 INT,
    score3 INT,
    score4 INT,
    average_score INT,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id, student_id) REFERENCES new_idiomas_course_student(course_id, student_id)
);

-- Estado de solicitud de rezago
CREATE TABLE new_idiomas_straggle_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Solicitud de rezago
CREATE TABLE new_idiomas_course_straggle_request (
    id INT PRIMARY KEY,
    prev_course_id INT,
    student_id INT,
    state_id INT,
    post_course_id INT,
    request_date TIMESTAMP,
    created_by INT,
    FOREIGN KEY (prev_course_id) REFERENCES new_idiomas_course(id),
    FOREIGN KEY (post_course_id) REFERENCES new_idiomas_course(id),
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_straggle_state(id),
    FOREIGN KEY (created_by) REFERENCES new_idiomas_user(id)
);

-- Modalidad de examen
CREATE TABLE new_idiomas_exam_modality (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Estado del examen
CREATE TABLE new_idiomas_exam_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Examen
CREATE TABLE new_idiomas_exam (
    id INT PRIMARY KEY,
    exam_modality_id INT,
    language_id INT,
    evaluation_jury_ids INT[],
    overseer_jury_ids INT[],
    date TIMESTAMP,
    start_hour VARCHAR(5),
    end_hour VARCHAR(5),
    state_id INT,
    enrollment_limit INT,
    enrolled_limit INT,
    created_by INT,
    FOREIGN KEY (exam_modality_id) REFERENCES new_idiomas_exam_modality(id),
    FOREIGN KEY (language_id) REFERENCES new_idiomas_language(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_exam_state(id),
    FOREIGN KEY (created_by) REFERENCES new_idiomas_user(id)
);

-- Solicitud de inscripción a examen
CREATE TABLE new_idiomas_exam_enrollment_request (
    id INT PRIMARY KEY,
    student_id INT,
    exam_id INT,
    payment_id INT,
    request_date TIMESTAMP,
    new_student_request_id INT,
    is_new_student BOOLEAN,
    state_id INT,
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (exam_id) REFERENCES new_idiomas_exam(id),
    FOREIGN KEY (payment_id) REFERENCES new_idiomas_payment(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_enrollment_request_state(id)
);

-- Estado del estudiante en examen
CREATE TABLE new_idiomas_exam_student_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Estudiante inscrito en examen
CREATE TABLE new_idiomas_exam_student (
    exam_id INT,
    student_id INT,
    state_id INT,
    PRIMARY KEY (exam_id, student_id),
    FOREIGN KEY (exam_id) REFERENCES new_idiomas_exam(id),
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_exam_student_state(id)
);

-- Nota del estudiante en examen
CREATE TABLE new_idiomas_exam_student_score (
    exam_id INT,
    student_id INT,
    score INT,
    PRIMARY KEY (exam_id, student_id),
    FOREIGN KEY (exam_id, student_id) REFERENCES new_idiomas_exam_student(exam_id, student_id)
);

-- Solicitud de rezago en examen
CREATE TABLE new_idiomas_exam_straggle_request (
    id INT PRIMARY KEY,
    prev_exam_id INT,
    student_id INT,
    state_id INT,
    post_exam_id INT,
    request_date TIMESTAMP,
    created_by INT,
    FOREIGN KEY (prev_exam_id) REFERENCES new_idiomas_exam(id),
    FOREIGN KEY (post_exam_id) REFERENCES new_idiomas_exam(id),
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_straggle_state(id),
    FOREIGN KEY (created_by) REFERENCES new_idiomas_user(id)
);

-- Estado de solicitud de suficiencia
CREATE TABLE new_idiomas_proficiency_request_state (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Solicitud de suficiencia
CREATE TABLE new_idiomas_proficiency_request (
    id INT PRIMARY KEY,
    student_id INT,
    language_id INT,
    level_id INT,
    payment_id INT,
    request_date TIMESTAMP,
    state_id INT,
    FOREIGN KEY (student_id) REFERENCES new_idiomas_student(id),
    FOREIGN KEY (language_id) REFERENCES new_idiomas_language(id),
    FOREIGN KEY (level_id) REFERENCES new_idiomas_level(id),
    FOREIGN KEY (payment_id) REFERENCES new_idiomas_payment(id),
    FOREIGN KEY (state_id) REFERENCES new_idiomas_proficiency_request_state(id)
);
