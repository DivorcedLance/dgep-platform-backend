import { db } from './db';
import { PostgraduateProgram } from './types/student';

export async function getPostgraduateProgramById(id: number): Promise<PostgraduateProgram | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name, code
      FROM new_idiomas_postgraduate_program
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

export async function getPostgraduateProgram(): Promise<PostgraduateProgram[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name, code
      FROM new_idiomas_postgraduate_program
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}