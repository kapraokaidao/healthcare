export type Gender = "Male" | "Female";

export type Role = "NHSO" | "Patient" | "Hospital" | "HospitalAdmin";

export type Token = "General" | "Special";

export type Hospital = {
  code9: string;
  fullname: string;
  unit: string;
  type: string;
  address: string;
  moo: string;
  tambon: string;
  amphur: string;
  province: string;
  zipcode: string;
  telephone: string;
};

export type Patient = {
  nationalId: string;
  gender: Gender;
  birthDate: Date;
  approved: boolean;
  nationalIdImage: string;
  selfieImage: string;
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
  hospital: Hospital | null;
  patient: Patient | null;
  createdDate: Date;
};

export type TokenDetail = {
  id: number;
  name: string;
  remainingToken: number;
  tokenType: Token;
  description: string;
  token: number;
  startAge: number | null;
  endAge: number | null;
  gender: Gender | null;
};

export type BalanceDetail = {
  balance: number;
  healthcareToken: TokenDetail;
};

export type HistoryTransaction = {
  id: number;
  name: string;
  amount: string;
};

export type UserCreate = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
};
