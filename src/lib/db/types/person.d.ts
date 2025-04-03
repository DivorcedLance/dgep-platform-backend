import { Country } from "./country";
import { DocType } from "./docType";

export type Person = {
  docNum: string;
  docType: DocType;
  names: string;
  fatherLastName: string;
  motherLastName: string;
  nationality: Country;
  phone: string;
  personalEmail: string;
  gender: string;
  birthDate: Date;
}

export type PersonCreate = {
  docNum: string;
  docTypeId: number;
  names: string;
  fatherLastName: string;
  motherLastName: string;
  nationalityId: number;
  phone: string;
  personalEmail: string;
  gender: string;
  birthDate: Date;
}