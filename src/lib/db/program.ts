import { db } from './db';
import { Program } from './types/program';

import { programTable } from '@/lib/db/tables';

export async function getProgramById(id: number): Promise<Program | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${programTable}
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

export async function getProgram(): Promise<Program[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${programTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}