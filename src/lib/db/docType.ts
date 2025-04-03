import { db } from './db';
import { DocType } from './types/docType';

export const docTypeTable = 'new_idiomas_document_type';

export async function getDocTypeById(id: number): Promise<DocType | null> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${docTypeTable}
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

export async function getDocType(): Promise<DocType[]> {
  const result = await db.execute({
    sql: `
      SELECT id, name
      FROM ${docTypeTable}
    `,
  });

  return result.rows.map((row) => ({
    id: row.id as number,
    name: row.name as string,
  }));
}