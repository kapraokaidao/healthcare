export type Sex = 'Male' | 'Female';

export type Role = 'NHSO' | 'Patient' | 'Hospital';

export type Hospital = {
	hid: number;
	name: string;
};

export type NHSO = {
	id: number;
};

export type Patient = {
	nationalId: string;
	gender: Sex;
	birthDate: Date;
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

export type FilterUser = {
	firstname?: string;
	surname?: string;
	role: Role;
	phone?: string;
	address?: string;
	nhso?: {
		id?: number;
	};
	hospital?: {
		name?: string;
		hid?: number;
	};
	patient?: {
		nationalId?: string;
		gender?: Sex;
		birthDate?: Date;
	};
};
