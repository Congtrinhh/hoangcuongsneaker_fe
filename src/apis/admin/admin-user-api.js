import axios from "../axios";
import BaseApi from "@/apis/base-api";
class AdminUserApi extends BaseApi {
	constructor() {
		super();
		this.controller = "AdminUsers";
	}
}

export default new AdminUserApi();
