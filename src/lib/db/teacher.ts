import { db } from './db';
import { TeacherState } from './types/teacher';

import { teacherStateTable } from '@/lib/db/tables';

export async function getTeacherStateById(id: number): Promise<TeacherState | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${teacherStateTable}
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

export async function getTeacherState(): Promise<TeacherState[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${teacherStateTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}