import axios from "../axios";
import BaseApi from "@/apis/base-api";
class OrderApi extends BaseApi {
	constructor() {
		super();
		this.controller = "Orders";
	}

	getProvinces() {
		return axios.get(`${this.controller}/provinces`);
	}

	getDistricts(provinceId = 0) {
		return axios.get(`${this.controller}/districts?provinceId=${provinceId}`);
	}

	getWards(districtId = 0) {
		return axios.get(`${this.controller}/wards?districtId=${districtId}`);
	}
}

export default new OrderApi();
