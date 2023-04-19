import axios from "../axios";
import BaseApi from "@/apis/base-api";
class AdminStatisticApi extends BaseApi {
	constructor() {
		super();
		this.controller = "AdminStatistic";
	}

	getProducts(pagingRequest = { pageSize: 5, pageIndex: 0 }) {
		return axios.post(`${this.controller}/admin-statistic`, pagingRequest);
	}
}

export default new AdminStatisticApi();
