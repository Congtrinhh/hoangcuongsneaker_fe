import axios from "@/apis/axios";
import BaseApi from "@/apis/base-api";
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
}

export default new AuthenticationApi();
