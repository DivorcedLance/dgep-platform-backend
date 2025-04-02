export type Role = {
  id: number;
  name: "Coordinador" | "Docente" | "Programador" | "Asesor" | "Asistente" | "Estudiante";
  description: string;
}