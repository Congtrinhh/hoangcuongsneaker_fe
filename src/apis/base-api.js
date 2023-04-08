import axios from "./axios";

class BaseApi {
	constructor(controller) {
		this.controller = controller || "";
	}

	getAll() {
		return axios.get(this.controller);
	}
	getById(id) {
		return axios.get(`${this.controller}/${id}`);
	}
	getPaging(pagingRequest) {
		return axios.post(`${this.controller}/paging`, pagingRequest);
	}
	create(payload) {
		return axios.post(`${this.controller}`, payload);
	}
	update(id, payload) {
		return axios.put(`${this.controller}/${id}`, payload);
	}
	delete(id) {
		return axios.delete(`${this.controller}/${id}`);
	}
}

export default BaseApi;
