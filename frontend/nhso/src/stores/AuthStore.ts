import { makeObservable, observable, computed } from 'mobx';
import axios from 'axios';
import { isEmpty } from 'lodash';

export type SignupType = {
	prefix: string;
	firstname: string;
	lastname: string;
	email: string;
	username: string;
	password: string;
	password_confirmation: string;
};

export type SigninType = {
	username: string;
	password: string;
};

type RawUser = {
	data: {
		id: number;
		username: string;
		email: string;
		prefix: string;
		firstname: string;
		lastname: string;
		prefix_en: string | null;
		firstname_en: string | null;
		lastname_en: string | null;
		tel_country_code: string | null;
		tel_number: string | null;
		avatar_url: string;
	};
};

export type User = {
	id: number;
	firstname: string;
	lastname: string;
};

class AuthStore {
	accessToken: string | null;
	rawUser: RawUser | null;

	constructor() {
		makeObservable(this, {
			accessToken: observable,
			rawUser: observable,
			isSignin: computed,
			user: computed,
		});
		console.log(`new auth store`);
		axios.defaults.baseURL = 'http://127.0.0.1:8000/api/v1';
		this.accessToken = localStorage.getItem('accessToken');
		this.rawUser = null;
		if (this.accessToken) {
			this.setAccessToken(this.accessToken);
			this.getUserInformation();
		}
	}

	get isSignin() {
		return !isEmpty(this.accessToken);
	}

	get user() {
		return {
			id: this.rawUser?.data.id,
			firstname: this.rawUser?.data.firstname,
			lastname: this.rawUser?.data.lastname,
			avatar_url:
				this.rawUser?.data.avatar_url || 'https://westeros.mycourseville.com/mcvev/files/profile-00011.svg',
		};
	}

	async signin(data: SigninType) {
		try {
			const res = await axios.post('/auth/login', data);
			const accessToken = res.data.data.accessToken;
			this.setAccessToken(accessToken);
			this.getUserInformation();
			return true;
		} catch (e) {
			return e.response.data.message;
		}
	}

	async signup(data: SignupType) {
		try {
			await axios.post('/auth/register', data);
			return true;
		} catch (e) {
			return e.response.data.errors;
		}
	}

	async signout() {
		try {
			this.clearAccessToken();
			await axios.post('/auth/logout');
			return true;
		} catch (e) {
			return e.response;
		}
	}

	async getUserInformation() {
		const { data: rawUser } = await axios.get<RawUser>('/auth/user');
		this.rawUser = rawUser;
	}

	private setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
		localStorage.setItem('accessToken', accessToken);
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
	}

	private clearAccessToken() {
		this.accessToken = null;
		this.rawUser = null;
		localStorage.removeItem('accessToken');
	}
}

export default AuthStore;
