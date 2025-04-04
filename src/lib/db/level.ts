import { db } from './db';
import { Level } from './types/level';

import { levelTable } from '@/lib/db/tables';

export async function getLevelById(id: number): Promise<Level | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${levelTable}
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

export async function getLevel(): Promise<Level[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${levelTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}