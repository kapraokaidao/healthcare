export type Gender = 'Male' | 'Female';

export type Role = 'NHSO' | 'Patient' | 'Hospital';

export type Token = 'General' | 'Special';

export type Hospital = {
	hid: number;
	name: string;
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
	surname: string;
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
	surname: string;
	role: Role;
	phone: string;
	address: string;
	nhso: NHSO | null;
	hospital: Hospital | null;
	patient: Patient | null;
	createdDate: Date;
};
