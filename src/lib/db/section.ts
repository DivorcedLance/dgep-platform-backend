import { db } from './db';
import { Section } from './types/section';

import { sectionTable } from '@/lib/db/tables';

export async function getSectionById(id: number): Promise<Section | null> {
    const result = await db.execute({
        sql: `
      SELECT id, name
      FROM ${sectionTable}
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

export async function getSection(): Promise<Section[]> {
    const result = await db.execute({
        sql: `
      SELECT id, name
      FROM ${sectionTable}
    `,
  });

    return result.rows.map((row) => ({
        id: row.id as number,
        name: row.name as string,
    }));
}