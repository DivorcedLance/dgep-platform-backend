import { db } from './db';
import { Role } from './types/role';

import { roleTable } from '@/lib/db/tables';

export async function getRoleById(id: number): Promise<Role | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${roleTable}
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

export async function getRole(): Promise<Role[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${roleTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}