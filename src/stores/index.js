import { defineStore } from "pinia";
export const useIndexStore = defineStore("index", {
	state: () => {
		return {
			isLoggedIn: false, // người dùng đã đăng nhập chưa
			category: null, // giới tính được chọn để lọc sản phẩm theo giới tính
		};
	},
	mutations: {},
	actions: {},
});
