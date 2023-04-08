import axios from "../axios";
import BaseApi from "@/apis/base-api";
class AdminProductInventoryApi extends BaseApi {
	constructor() {
		super();
		this.controller = "AdminProductInventories";
	}
}

export default new AdminProductInventoryApi();
