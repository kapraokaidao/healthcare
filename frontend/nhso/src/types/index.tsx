export type Gender = "Male" | "Female";

export type Role = "NHSO" | "Patient" | "Hospital";

export type Token = "General" | "Special";

export type Hospital = {
  code9: string;
  fullname?: string;
};

export type NHSO = {
  id: number;
};

export type Patient = {
  nationalId: string;
  gender: Gender;
  birthDate: Date;
  approved: boolean;
  nationalIdImage: string;
  selfieImage: string;
};

export type UserCreate = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: Role;
  phone: string;
  address: string;
  nhso?: NHSO;
  hospital?: Hospital;
  patient?: Patient;
};

export type User = {
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: Role;
  phone: string;
  address: string;
  nhso: NHSO | null;
  hospital: Hospital | null;
  patient: Patient | null;
  createdDate: Date;
};

export type TokenCreate = {
  name: string;
  tokenType: Token;
  description: string;
  totalToken: number;
  tokenPerPerson: number;
  startDate?: string;
  endDate?: string;
  startAge?: number;
  endAge?: number;
  gender?: Gender;
};

export type TokenDetail = TokenCreate & {
  id: number;
  remainingToken: number;
  isActive: boolean;
  issuingPublicKey: boolean;
  receivingPublicKey: boolean;
  startDate: Date;
  endDate: Date;
  startAge: number;
  endAge: number;
  gender: Gender;
};
