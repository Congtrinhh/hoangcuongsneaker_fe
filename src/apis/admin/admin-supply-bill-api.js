import axios from "../axios";
import BaseApi from "@/apis/base-api";
class AdminSupplyBillApi extends BaseApi {
	constructor() {
		super();
		this.controller = "AdminSupplyBills";
	}
}

export default new AdminSupplyBillApi();
