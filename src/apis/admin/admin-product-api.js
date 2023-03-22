import axios from "../axios";
import BaseApi from "@/apis/base-api";
class AdminProductApi extends BaseApi {
	constructor() {
		super();
		this.controller = "AdminProducts";
	}

	getBySlug(slug) {
		return axios.get(`${this.controller}/by-slug/${slug}`);
	}
}

export default new AdminProductApi();
