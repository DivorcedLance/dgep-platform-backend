import { db } from './db';
import { PostgraduateProgram } from './types/student';

export async function getPostgraduateProgramById(
  program_id: number,
  faculty_id: number
): Promise<PostgraduateProgram | null> {
  const result = await db.execute({
    sql: `
      SELECT program_id, faculty_id, name
      FROM new_idiomas_postgraduate_program
      WHERE program_id = ? AND faculty_id = ?
      LIMIT 1
    `,
    args: [program_id, faculty_id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    id: Number(row.program_id),
    name: String(row.name),
  };
}

export async function getPostgraduateProgramByFacultyId(
  faculty_id: number
): Promise<PostgraduateProgram[]> {
  const result = await db.execute({
    sql: `
      SELECT program_id, faculty_id, name
      FROM new_idiomas_postgraduate_program
      WHERE faculty_id = ?
    `,
    args: [faculty_id],
  });

  return result.rows.map((row) => ({
    id: Number(row.program_id),
    name: String(row.name),
  })) as PostgraduateProgram[];
}

export async function getPostgraduateProgramGroupedByFaculty() : Promise<Record<number, PostgraduateProgram[]>> {
  const result = await db.execute({
    sql: `
      SELECT program_id, faculty_id, name
      FROM new_idiomas_postgraduate_program
    `,
  });

  const grouped = result.rows.reduce((acc, row) => {
    const facultyId = Number(row.faculty_id);
    if (!acc[facultyId]) {
      acc[facultyId] = [];
    }
    acc[facultyId].push({
      id: Number(row.program_id),
      name: String(row.name),
    });
    return acc;
  }, {} as Record<number, PostgraduateProgram[]>);

  return grouped;
}