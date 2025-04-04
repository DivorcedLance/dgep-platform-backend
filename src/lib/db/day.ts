import { db } from './db';
import { Day } from './types/day';

import { dayTable } from '@/lib/db/tables';

export async function getDayById(id: number): Promise<Day | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${dayTable}
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

export async function getDay(): Promise<Day[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${dayTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}
