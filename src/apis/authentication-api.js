import axios from "@/apis/axios";
import BaseApi from "@/apis/base-api";
import { useIndexStore } from "@/stores";

class AuthenticationApi extends BaseApi {
	constructor() {
		super();
		this.controller = "Authentication";
	}

	doLogin(payload) {
		return axios.post(`${this.controller}/login`, payload);
	}

	doRegistration(payload) {
		return axios.post(`${this.controller}/registration`, payload);
	}

	doLogout() {
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("userInfo");

		useIndexStore.isLoggedIn = false;
		useIndexStore.userInfo = null;
	}
}

export default new AuthenticationApi();
