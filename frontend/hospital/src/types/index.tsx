export type Gender = 'Male' | 'Female';

export type Role = 'NHSO' | 'Patient' | 'Hospital';

export type Token = 'General' | 'Special';

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
	name: string;
	tokenType: Token;
	description: string;
	token: number;
	startDate?: string;
	endDate?: string;
	startAge?: number;
	endAge?: number;
	gender?: Gender;
};
