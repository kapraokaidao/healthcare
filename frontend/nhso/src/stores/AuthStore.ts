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

type UserMe = {
	username: string;
	firstname: string;
	lastname: string;
	role: string;
	phone: string;
};

class AuthStore {
	accessToken: string | null;
	userMe: UserMe | null;

	constructor() {
		makeObservable(this, {
			accessToken: observable,
			userMe: observable,
			isSignin: computed,
			user: computed,
		});
		console.log(`new auth store`);
		axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
		this.accessToken = localStorage.getItem('accessToken');
		this.userMe = null;
		if (this.accessToken) {
			this.setAccessToken(this.accessToken);
			this.getUserInformation();
		}
	}

	get isSignin() {
		return !isEmpty(this.accessToken);
	}

	get user() {
		return this.userMe;
	}

	async signin(data: SigninType) {
		const res = await axios.post('/auth/login', data);
		const accessToken = res.data.access_token;
		this.setAccessToken(accessToken);
		this.getUserInformation();
		return true;
	}

	async getUserInformation() {
		const { data } = await axios.get<UserMe>('/user/me');
		this.userMe = data;
	}

	async signup(data: SignupType) {
		await axios.post('/auth/register', data);
		return true;
	}

	async signout() {
		this.clearAccessToken();
		return true;
	}

	private setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
		localStorage.setItem('accessToken', accessToken);
		axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
	}

	private clearAccessToken() {
		this.accessToken = null;
		this.userMe = null;
		localStorage.removeItem('accessToken');
	}
}

export default AuthStore;
