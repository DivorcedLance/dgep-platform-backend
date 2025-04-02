import { db } from './db';
import { UserCreate, User } from './types/user';

export async function createUser(user: UserCreate): Promise<User> {
  const tx = await db.transaction();

  try {
    // 1. Insertar persona
    const personResult = await tx.execute({
      sql: `
        INSERT INTO new_idiomas_person (
          doc_num, doc_type_id, names, father_last_name, mother_last_name,
          nationality_id, phone, personal_email, gender, birthDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
      `,
      args: [
        user.docNum, user.docTypeId, user.names, user.fatherLastName, user.motherLastName,
        user.nationalityId, user.phone, user.personalEmail, user.gender, user.birthDate
      ],
    });

    const personId = personResult.rows[0].id;

    // 2. Insertar usuario
    const userResult = await tx.execute({
      sql: `
        INSERT INTO new_idiomas_user (
          person_id, password, role_id, is_active
        ) VALUES (?, ?, ?, ?)
        RETURNING id
      `,
      args: [personId, user.password, user.roleId, user.isActive],
    });

    const userId = userResult.rows[0].id;

    // 3. Insertar datos específicos de rol
    let roleData: any = undefined;

    if (user.roleId === 2) {
      // Docente
      const teacherData = user.roleData;
      await tx.execute({
        sql: `
          INSERT INTO new_idiomas_teacher (user_id, state_id)
          VALUES (?, ?)
        `,
        args: [userId, teacherData.stateId],
      });

      for (const languageId of teacherData.languageIds) {
        await tx.execute({
          sql: `
            INSERT INTO new_idiomas_teacher_language (teacher_id, language_id)
            VALUES (?, ?)
          `,
          args: [userId, languageId],
        });
      }

      roleData = {
        stateId: teacherData.stateId,
        languageIds: teacherData.languageIds,
      };

    } else if (user.roleId === 6) {
      // Estudiante
      const studentData = user.roleData;
      await tx.execute({
        sql: `
          INSERT INTO new_idiomas_student (
            user_id, student_code, postgraduate_permanency_id,
            faculty_id, postgraduate_program_id, postgraduate_enrollment_count,
            postgraduate_admission_year, state_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          userId, studentData.studentCode, studentData.postgraduatePermanencyId,
          studentData.facultyId, studentData.postgraduateProgramId, studentData.postgraduateEnrollmentCount,
          studentData.postgraduateAdmissionYear, studentData.stateId
        ],
      });

      roleData = studentData;
    }

    // 4. Obtener role.name
    const roleResult = await tx.execute({
      sql: `SELECT id, name FROM new_idiomas_role WHERE id = ?`,
      args: [user.roleId],
    });

    const role = roleResult.rows[0];

    // 5. Devolver objeto User completo
    const userResponse: User = {
      id: userId,
      isActive: user.isActive,
      role: {
        id: role.id,
        name: role.name,
      },
      roleId: user.roleId,
      roleData: roleData,
      // Datos de persona
      docNum: user.docNum,
      docTypeId: user.docTypeId,
      names: user.names,
      fatherLastName: user.fatherLastName,
      motherLastName: user.motherLastName,
      nationalityId: user.nationalityId,
      phone: user.phone,
      personalEmail: user.personalEmail,
      gender: user.gender,
      birthDate: user.birthDate,
    } as User;

    await tx.commit();
    return userResponse;

  } catch (error) {
    await tx.rollback();
    console.error('Error al crear usuario:', error);
    throw error;
  }
}
