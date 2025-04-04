import { db } from '@/lib/db/db';
import { getCountry, getCountryById } from '@/lib/db/country';
import { getDocType, getDocTypeById } from '@/lib/db/docType';
import { getFaculty, getFacultyById } from '@/lib/db/faculty';
import { getPostgraduatePermanency, getPostgraduatePermanencyById } from '@/lib/db/postgraduatePermanency';
import { getPostgraduateProgramGroupedByFaculty, getPostgraduateProgramById } from '@/lib/db/postgraduateProgram';
import { getStudentState, getStudentStateById } from '@/lib/db/student';
import { getTeacherState, getTeacherStateById } from '@/lib/db/teacher';
import { getRole, getRoleById } from '@/lib/db/role';
import { PostgraduatePermanency, PostgraduateProgram, StudentData, StudentDataCreate, StudentState } from '@/lib/db/types/student';
import { TeacherData, TeacherDataCreate, TeacherState } from '@/lib/db/types/teacher';
import { UserCreate, User } from '@/lib/db/types/user';
import { UserDetails } from '@/lib/db/types/details';
import { getLanguage } from './language';
import { DocType } from '@/lib/db/types/docType';
import { Role } from '@/lib/db/types/role';
import { Language } from '@/lib/db/types/language';
import { Country } from '@/lib/db/types/country';
import { Faculty } from '@/lib/db/types/faculty';
import { languageTable, personTable, studentTable, teacherLanguageTable, teacherTable, userTable } from '@/lib/db/tables';

export async function getUserDetails(): Promise<UserDetails> {
  const [docTypes, roles, teacherStates, languages, studentStates, countries, faculties, postgraduatePrograms, postgraduatePermanencies] = await Promise.all([
    getDocType(),
    getRole(),
    getTeacherState(),
    getLanguage(),
    getStudentState(),
    getCountry(),
    getFaculty(),
    getPostgraduateProgramGroupedByFaculty(),
    getPostgraduatePermanency(),
  ]);

  return {
    docTypes: docTypes as DocType[],
    roles: roles as Role[],
    teacherStates: teacherStates as TeacherState[],
    languages: languages as Language[],
    studentStates: studentStates as StudentState[],
    countries: countries as Country[],
    faculties: faculties as Faculty[],
    postgraduatePrograms: postgraduatePrograms as Record<number, PostgraduateProgram[]>,
    postgraduatePermanencies: postgraduatePermanencies as PostgraduatePermanency[],
  };
}


export async function createUser(userCreate: UserCreate): Promise<User> {
  const tx = await db.transaction();

  try {
    // 1. Insertar persona
    const personResult = await tx.execute({
      sql: `
        INSERT INTO ${personTable} (
          doc_num, doc_type_id, names, father_last_name, mother_last_name,
          nationality_id, phone, personal_email, gender, birthDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        userCreate.docNum, userCreate.docTypeId, userCreate.names, userCreate.fatherLastName, userCreate.motherLastName,
        userCreate.nationalityId, userCreate.phone, userCreate.personalEmail, userCreate.gender, userCreate.birthDate
      ],
    });

    const personId = personResult.rows[0].id;

    console.log(personResult)

    // 2. Insertar usuario
    const userResult = await tx.execute({
      sql: `
        INSERT INTO ${userTable} (
          person_id, password, role_id, is_active
        ) VALUES (?, ?, ?, ?)
        RETURNING id
      `,
      args: [personId, userCreate.password, userCreate.roleId, userCreate.isActive],
    });

    const userId = userResult.rows[0].id;

    console.log(userResult)

    let roleData: TeacherData | StudentData | undefined = undefined;

    // 3. Insertar y obtener datos del rol
    if (userCreate.roleId === 2) {
      // Docente
      const teacherData = userCreate.roleData as TeacherDataCreate;

      const teacherResult = await tx.execute({
        sql: `
          INSERT INTO ${teacherTable} (user_id, state_id)
          VALUES (?, ?)
          RETURNING id
        `,
        args: [userId, teacherData.stateId],
      });

      const teacherId = teacherResult.rows[0].id;

      for (const languageId of teacherData.specializedLanguageIds) {
        await tx.execute({
          sql: `
            INSERT INTO ${teacherLanguageTable} (teacher_id, language_id)
            VALUES (?, ?)
          `,
          args: [userId, languageId],
        });
      }

      const languageResult = await tx.execute({
        sql: `
          SELECT l.id, l.name 
          FROM ${teacherLanguageTable} tl
          JOIN ${languageTable} l ON l.id = tl.language_id
          WHERE tl.teacher_id = ?
        `,
        args: [userId],
      });

      roleData = {
        id: teacherId,
        state: await getTeacherStateById(teacherData.stateId),
        specializedLanguages: languageResult.rows.map((row) => ({
          id: row.id,
          name: row.name,
        })),
      } as TeacherData;

    } else if (userCreate.roleId === 6) {
      // Estudiante
      const studentData = userCreate.roleData as StudentDataCreate;

      const studentResult = await tx.execute({
        sql: `
          INSERT INTO ${studentTable} (
            user_id, student_code, postgraduate_permanency_id,
            faculty_id, postgraduate_program_id, postgraduate_enrollment_count,
            postgraduate_admission_year, state_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          RETURNING id
        `,
        args: [
          userId, studentData.studentCode, studentData.postgraduatePermanencyId,
          studentData.facultyId, studentData.postgraduateProgramId, studentData.postgraduateEnrollmentCount,
          studentData.postgraduateAdmissionYear, studentData.stateId
        ],
      });

      console.log(studentResult)

      const studentId = studentResult.rows[0].id;

      const [postgraduatePermanency, faculty, postgraduateProgram, studentState] = await Promise.all([
        getPostgraduatePermanencyById(studentData.postgraduatePermanencyId),
        getFacultyById(studentData.facultyId),
        getPostgraduateProgramById(studentData.postgraduateProgramId, studentData.facultyId),
        getStudentStateById(studentData.stateId),
      ]);

      if (!studentId ||!postgraduatePermanency || !faculty || !postgraduateProgram || !studentState) {
        throw new Error('Error al obtener datos relacionados con el estudiante.');
      }

      roleData = {
        id: studentId as number,
        studentCode: studentData.studentCode,
        postgraduatePermanency,
        faculty,
        postgraduateProgram,
        postgraduateEnrollmentCount: studentData.postgraduateEnrollmentCount,
        postgraduateAdmissionYear: studentData.postgraduateAdmissionYear,
        state: studentState,
      };
    }

    // 4. Obtener rol, tipo de doc y nacionalidad
    const [role, docType, nationality] = await Promise.all([
      getRoleById(userCreate.roleId),
      getDocTypeById(userCreate.docTypeId),
      getCountryById(userCreate.nationalityId),
    ]);

    if (!role || !docType || !nationality) {
      throw new Error('Error al obtener datos relacionados con el usuario.');
    }

    const baseUser: Omit<User, 'roleData' |  'role' | 'roleId'> = {
      id: userId as number,
      isActive: userCreate.isActive,
      docNum: userCreate.docNum,
      docType,
      names: userCreate.names,
      fatherLastName: userCreate.fatherLastName,
      motherLastName: userCreate.motherLastName,
      nationality,
      phone: userCreate.phone,
      personalEmail: userCreate.personalEmail,
      gender: userCreate.gender,
      birthDate: userCreate.birthDate,
    };

    console.log(baseUser)
    
    await tx.commit();

    if (userCreate.roleId === 2) {
      return {
        ...baseUser,
        role,
        roleId: userCreate.roleId,
        roleData: roleData as TeacherData,
      }
    }
    else if (userCreate.roleId === 6) {
      return {
        ...baseUser,
        role,
        roleId: userCreate.roleId,
        roleData: roleData as StudentData,
      }
    }
    else {
      return {
        ...baseUser,
        role,
        roleId: userCreate.roleId,
        roleData: undefined,
      } as User;
    }
  } catch (error) {
    await tx.rollback();
    console.error('Error al crear usuario:', error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<User | null> {
  const userResult = await db.execute({
    sql: `
      SELECT 
        u.id, u.is_active, u.role_id, p.doc_num, p.doc_type_id, p.names, 
        p.father_last_name, p.mother_last_name, p.nationality_id, p.phone, 
        p.personal_email, p.gender, p.birthDate
      FROM ${userTable} u
      JOIN ${personTable} p ON u.person_id = p.id
      WHERE u.id = ?
    `,
    args: [id],
  });

  if (userResult.rows.length === 0) {
    return null;
  }

  const userRow = userResult.rows[0];

  const [role, docType, nationality] = await Promise.all([
    getRoleById(userRow.role_id as number),
    getDocTypeById(userRow.doc_type_id as number),
    getCountryById(userRow.nationality_id as number),
  ]);

  if (!role || !docType || !nationality) {
    throw new Error('Error al obtener datos relacionados con el usuario.');
  }

  const baseUser: Omit<User, 'roleData' | 'role' | 'roleId'> = {
    id: userRow.id as number,
    isActive: Boolean(userRow.is_active),
    docNum: userRow.doc_num as string,
    docType,
    names: userRow.names as string,
    fatherLastName: userRow.father_last_name as string,
    motherLastName: userRow.mother_last_name as string,
    nationality,
    phone: userRow.phone as string,
    personalEmail: userRow.personal_email as string,
    gender: userRow.gender as string,
    birthDate: new Date(userRow.birthDate as string),
  };

  let roleData: TeacherData | StudentData | undefined = undefined;

  if (userRow.role_id === 2) {
    // Docente
    const teacherResult = await db.execute({
      sql: `
        SELECT t.id, t.state_id
        FROM ${teacherTable} t
        WHERE t.user_id = ?
      `,
      args: [userRow.id],
    });

    if (teacherResult.rows.length === 0) {
      throw new Error('No se encontraron datos del docente.');
    }

    const teacherRow = teacherResult.rows[0];

    const languageResult = await db.execute({
      sql: `
        SELECT l.id, l.name
        FROM ${teacherLanguageTable} tl
        JOIN ${languageTable} l ON l.id = tl.language_id
        WHERE tl.teacher_id = ?
      `,
      args: [teacherRow.id],
    });

    const teacherState = await getTeacherStateById(teacherRow.state_id as number);

    if (!teacherState) {
      throw new Error('Error al obtener el estado del docente.');
    }

    roleData = {
      id: teacherRow.id,
      state: teacherState,
      specializedLanguages: languageResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
      })),
    } as TeacherData;
  } else if (userRow.role_id === 6) {
    // Estudiante
    const studentResult = await db.execute({
      sql: `
        SELECT 
          s.id, s.student_code, s.postgraduate_permanency_id, s.faculty_id, 
          s.postgraduate_program_id, s.postgraduate_enrollment_count, 
          s.postgraduate_admission_year, s.state_id
        FROM ${studentTable} s
        WHERE s.user_id = ?
      `,
      args: [userRow.id],
    });

    if (studentResult.rows.length === 0) {
      throw new Error('No se encontraron datos del estudiante.');
    }

    const studentRow = studentResult.rows[0];

    const [postgraduatePermanency, faculty, postgraduateProgram, studentState] = await Promise.all([
      getPostgraduatePermanencyById(studentRow.postgraduate_permanency_id as number),
      getFacultyById(studentRow.faculty_id as number),
      getPostgraduateProgramById(studentRow.postgraduate_program_id as number, studentRow.faculty_id as number),
      getStudentStateById(studentRow.state_id as number),
    ]);

    if (!postgraduatePermanency || !faculty || !postgraduateProgram || !studentState) {
      throw new Error('Error al obtener datos relacionados con el estudiante.');
    }

    roleData = {
      id: studentRow.id,
      studentCode: studentRow.student_code,
      postgraduatePermanency,
      faculty,
      postgraduateProgram,
      postgraduateEnrollmentCount: studentRow.postgraduate_enrollment_count,
      postgraduateAdmissionYear: studentRow.postgraduate_admission_year,
      state: studentState,
    } as StudentData;
  }

  return {
    ...baseUser,
    role,
    roleId: userRow.role_id,
    roleData,
  } as User;
}

export async function getUser(): Promise<User[]> {
  const userResult = await db.execute({
    sql: `
      SELECT 
        u.id, u.is_active, u.role_id, p.doc_num, p.doc_type_id, p.names, 
        p.father_last_name, p.mother_last_name, p.nationality_id, p.phone, 
        p.personal_email, p.gender, p.birthDate
      FROM ${userTable} u
      JOIN ${personTable} p ON u.person_id = p.id
    `,
    args: [],
  });

  const [roles, docTypes, nationalities, faculties, postgraduatePermanencies, postgraduatePrograms, studentStates, teacherStates] = await Promise.all([
    getRole(),
    getDocType(),
    getCountry(),
    getFaculty(),
    getPostgraduatePermanency(),
    getPostgraduateProgramGroupedByFaculty(),
    getStudentState(),
    getTeacherState(),
  ]);

  const roleMap = new Map(roles.map((role) => [role.id, role]));
  const docTypeMap = new Map(docTypes.map((docType) => [docType.id, docType]));
  const nationalityMap = new Map(nationalities.map((country) => [country.id, country]));
  const facultyMap = new Map(faculties.map((faculty) => [faculty.id, faculty]));
  const postgraduatePermanencyMap = new Map(postgraduatePermanencies.map((item) => [item.id, item]));
  const postgraduateProgramMap = new Map<number, PostgraduateProgram[]>(
    Object.entries(postgraduatePrograms).map(([facultyId, programs]) => [Number(facultyId), programs])
  );
  const studentStateMap = new Map(studentStates.map((state) => [state.id, state]));
  const teacherStateMap = new Map(teacherStates.map((state) => [state.id, state]));

  const users: User[] = [];

  for (const userRow of userResult.rows) {
    const role = roleMap.get(userRow.role_id as number);
    const docType = docTypeMap.get(userRow.doc_type_id as number);
    const nationality = nationalityMap.get(userRow.nationality_id as number);

    if (!role || !docType || !nationality) {
      throw new Error('Error al obtener datos relacionados con el usuario.');
    }

    const baseUser: Omit<User, 'roleData' | 'role' | 'roleId'> = {
      id: userRow.id as number,
      isActive: Boolean(userRow.is_active),
      docNum: userRow.doc_num as string,
      docType,
      names: userRow.names as string,
      fatherLastName: userRow.father_last_name as string,
      motherLastName: userRow.mother_last_name as string,
      nationality,
      phone: userRow.phone as string,
      personalEmail: userRow.personal_email as string,
      gender: userRow.gender as string,
      birthDate: new Date(userRow.birthDate as string),
    };

    let roleData: TeacherData | StudentData | undefined = undefined;

    if (userRow.role_id === 2) {
      // Docente
      const teacherResult = await db.execute({
        sql: `
          SELECT t.id, t.state_id
          FROM ${teacherTable} t
          WHERE t.user_id = ?
        `,
        args: [userRow.id],
      });

      if (teacherResult.rows.length > 0) {
        const teacherRow = teacherResult.rows[0];

        const languageResult = await db.execute({
          sql: `
            SELECT l.id, l.name
            FROM ${teacherLanguageTable} tl
            JOIN ${languageTable} l ON l.id = tl.language_id
            WHERE tl.teacher_id = ?
          `,
          args: [teacherRow.id],
        });

        const teacherState = teacherStateMap.get(teacherRow.state_id as number);

        if (teacherState) {
          roleData = {
            id: teacherRow.id,
            state: teacherState,
            specializedLanguages: languageResult.rows.map((row) => ({
              id: row.id,
              name: row.name,
            })),
          } as TeacherData;
        }
      }
    } else if (userRow.role_id === 6) {
      // Estudiante
      const studentResult = await db.execute({
        sql: `
          SELECT 
            s.id, s.student_code, s.postgraduate_permanency_id, s.faculty_id, 
            s.postgraduate_program_id, s.postgraduate_enrollment_count, 
            s.postgraduate_admission_year, s.state_id
          FROM ${studentTable} s
          WHERE s.user_id = ?
        `,
        args: [userRow.id],
      });

      if (studentResult.rows.length > 0) {
        const studentRow = studentResult.rows[0];

        const postgraduatePermanency = postgraduatePermanencyMap.get(studentRow.postgraduate_permanency_id as number);
        const faculty = facultyMap.get(studentRow.faculty_id as number);
        const postgraduateProgram = postgraduateProgramMap.get(studentRow.faculty_id as number)?.find(
          (program) => program.id === studentRow.postgraduate_program_id
        );
        const studentState = studentStateMap.get(studentRow.state_id as number);

        if (postgraduatePermanency && faculty && postgraduateProgram && studentState) {
          roleData = {
            id: studentRow.id,
            studentCode: studentRow.student_code,
            postgraduatePermanency,
            faculty,
            postgraduateProgram,
            postgraduateEnrollmentCount: studentRow.postgraduate_enrollment_count,
            postgraduateAdmissionYear: studentRow.postgraduate_admission_year,
            state: studentState,
          } as StudentData;
        }
      }
    }

    users.push({
      ...baseUser,
      role,
      roleId: userRow.role_id,
      roleData,
    } as User);
  }

  return users;
}

export async function updateUser(userId: number, userUpdate: Partial<UserCreate>): Promise<User | null> {
  const tx = await db.transaction();

  try {
    // 1. Update person data
    if (userUpdate.docNum || userUpdate.docTypeId || userUpdate.names || userUpdate.fatherLastName || userUpdate.motherLastName || userUpdate.nationalityId || userUpdate.phone || userUpdate.personalEmail || userUpdate.gender || userUpdate.birthDate) {
      await tx.execute({
        sql: `
          UPDATE ${personTable}
          SET 
            doc_num = COALESCE(?, doc_num),
            doc_type_id = COALESCE(?, doc_type_id),
            names = COALESCE(?, names),
            father_last_name = COALESCE(?, father_last_name),
            mother_last_name = COALESCE(?, mother_last_name),
            nationality_id = COALESCE(?, nationality_id),
            phone = COALESCE(?, phone),
            personal_email = COALESCE(?, personal_email),
            gender = COALESCE(?, gender),
            birthDate = COALESCE(?, birthDate)
          WHERE id = (SELECT person_id FROM ${userTable} WHERE id = ?)
        `,
        args: [
          userUpdate.docNum || null,
          userUpdate.docTypeId || null, 
          userUpdate.names || null, 
          userUpdate.fatherLastName || null, 
          userUpdate.motherLastName || null,
          userUpdate.nationalityId || null, 
          userUpdate.phone || null, 
          userUpdate.personalEmail || null, 
          userUpdate.gender || null, 
          userUpdate.birthDate || null,
          userId,
        ],
      });
    }

    // 2. Update user data
    if (userUpdate.password || userUpdate.roleId || userUpdate.isActive !== undefined) {
      await tx.execute({
        sql: `
          UPDATE ${userTable}
          SET 
            password = COALESCE(?, password),
            role_id = COALESCE(?, role_id),
            is_active = COALESCE(?, is_active)
          WHERE id = ?
        `,
        args: [userUpdate.password || null, 
              userUpdate.roleId || null, 
              userUpdate.isActive || null, 
              userId
        ],
      });
    }

    // 3. Update role-specific data
    if (userUpdate.roleId === 2 && userUpdate.roleData) {
      // Update teacher data
      const teacherData = userUpdate.roleData as TeacherDataCreate;

      if (teacherData.stateId) {
        await tx.execute({
          sql: `
            UPDATE ${teacherTable}
            SET state_id = COALESCE(?, state_id)
            WHERE user_id = ?
          `,
          args: [teacherData.stateId, userId],
        });
      }

      if (teacherData.specializedLanguageIds) {
        await tx.execute({
          sql: `DELETE FROM ${teacherLanguageTable} WHERE teacher_id = (SELECT id FROM ${teacherTable} WHERE user_id = ?)`,
          args: [userId],
        });

        for (const languageId of teacherData.specializedLanguageIds) {
          await tx.execute({
            sql: `
              INSERT INTO ${teacherLanguageTable} (teacher_id, language_id)
              VALUES ((SELECT id FROM ${teacherTable} WHERE user_id = ?), ?)
            `,
            args: [userId, languageId],
          });
        }
      }
    } else if (userUpdate.roleId === 6 && userUpdate.roleData) {
      // Update student data
      const studentData = userUpdate.roleData as StudentDataCreate;

      await tx.execute({
        sql: `
          UPDATE ${studentTable}
          SET 
            student_code = COALESCE(?, student_code),
            postgraduate_permanency_id = COALESCE(?, postgraduate_permanency_id),
            faculty_id = COALESCE(?, faculty_id),
            postgraduate_program_id = COALESCE(?, postgraduate_program_id),
            postgraduate_enrollment_count = COALESCE(?, postgraduate_enrollment_count),
            postgraduate_admission_year = COALESCE(?, postgraduate_admission_year),
            state_id = COALESCE(?, state_id)
          WHERE user_id = ?
        `,
        args: [
          studentData.studentCode, studentData.postgraduatePermanencyId, studentData.facultyId,
          studentData.postgraduateProgramId, studentData.postgraduateEnrollmentCount,
          studentData.postgraduateAdmissionYear, studentData.stateId, userId,
        ],
      });
    }

    await tx.commit();

    // Return updated user
    return await getUserById(userId);
  } catch (error) {
    await tx.rollback();
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
}