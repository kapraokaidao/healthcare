import { makeObservable, observable, computed } from 'mobx';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { User } from '../types';

export type SigninType = {
	username: string;
	password: string;
};

class AuthStore {
	accessToken: string | null;
	user: User | null;

	constructor() {
		makeObservable(this, {
			accessToken: observable,
			user: observable,
			isSignin: computed,
		});
		console.log(`new auth store`);
		axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
		this.accessToken = localStorage.getItem('accessToken');
		this.user = null;
		if (this.accessToken) {
			this.setAccessToken(this.accessToken);
			this.getUserInformation();
		}
	}

	get isSignin() {
		return !isEmpty(this.accessToken);
	}

	async signin(data: SigninType) {
		const res = await axios.post('/hospital/login', data);
		const accessToken = res.data.access_token;
		this.setAccessToken(accessToken);
		this.getUserInformation();
		return true;
	}

	async changePassword(currentPassword: string, newPassword: string) {
		const res = await axios.post("/hospital/password/change", {
		  username: this.user?.username,
		  password: currentPassword,
		  newPassword,
		});
		const accessToken = res.data.access_token;
		this.setAccessToken(accessToken);
		return true;
	  }

	async getUserInformation() {
		const { data } = await axios.get<User>('/user/me');
		this.user = data;
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
		this.user = null;
		localStorage.removeItem('accessToken');
	}
}

export default AuthStore;
