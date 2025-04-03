import { db } from './db';
import { Language } from './types/language';
import { languageTable } from '@/lib/db/tables';

export async function getLanguageById(id: number): Promise<Language | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${languageTable}
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

export async function getLanguageByIds(ids: number[]): Promise<Language[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${languageTable}
      WHERE id IN (${ids.join(',')})
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}

export async function getLanguage(): Promise<Language[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${languageTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}