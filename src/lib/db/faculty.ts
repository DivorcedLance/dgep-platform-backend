import { db } from './db';
import { Faculty } from './types/faculty';

export async function getFacultyById(id: number): Promise<Faculty | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM new_idiomas_faculty
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

export async function getFaculty(): Promise<Faculty[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM new_idiomas_faculty
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}