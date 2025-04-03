import { db } from './db';
import { StudentState } from './types/student';

export async function getStudentStateById(id: number): Promise<StudentState | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM new_idiomas_student_state
      WHERE id = ?
    `,
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: row.id as number,
    name: row.name as string,
  };
}

export async function getStudentState(): Promise<StudentState[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM new_idiomas_student_state
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}