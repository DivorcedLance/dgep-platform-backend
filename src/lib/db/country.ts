import { db } from './db';
import { Country } from './types/country';

export async function getCountryById(id: number): Promise<Country | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name, code
      FROM new_idiomas_country
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

export async function getCountry(): Promise<Country[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name, code
      FROM new_idiomas_country
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}