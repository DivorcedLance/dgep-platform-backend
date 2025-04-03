import { db } from './db';
import { Faculty } from './types/faculty';

import { facultyTable } from '@/lib/db/tables';

export async function getFacultyById(id: number): Promise<Faculty | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${facultyTable}
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
      FROM ${facultyTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}