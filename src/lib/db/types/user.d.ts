import { Person, PersonCreate } from "./person";
import { Role } from "./role";
import { StudentData } from "./student";
import { TeacherData } from "./teacher";

export type BaseUser = Person & {
  id: number;
  role: Role;
  isActive: boolean;
}

export type TeacherUser = BaseUser & {
  roleId: 2;
  roleData: TeacherData;
};

export type StudentUser = BaseUser & {
  roleId: 6;
  roleData: StudentData;
};

export type GenericUser = BaseUser & {
  roleId: Exclude<number, 2 | 6>;
  roleData?: undefined;
};

export type User = TeacherUser | StudentUser | GenericUser;

export type BaseUserCreate = PersonCreate & {
  password: string;
  isActive: boolean;
};

export type TeacherUserCreate = BaseUserCreate & {
  roleId: 2;
  roleData: TeacherDataCreate;
};

export type StudentUserCreate = BaseUserCreate & {
  roleId: 6;
  roleData: StudentDataCreate;
};

export type GenericUserCreate = BaseUserCreate & {
  roleId: Exclude<number, 2 | 6>;
  roleData?: undefined;
};

export type UserCreate = TeacherUserCreate | StudentUserCreate | GenericUserCreate;
