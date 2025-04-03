import { db } from './db';
import { PostgraduatePermanency } from './types/student';

export async function getPostgraduatePermanencyById(id: number): Promise<PostgraduatePermanency | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name, code
      FROM new_idiomas_postgraduate_permanency
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

export async function getPostgraduatePermanency(): Promise<PostgraduatePermanency[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name, code
      FROM new_idiomas_postgraduate_permanency
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}