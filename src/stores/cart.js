import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
	state: () => {
		return {
			hasUpdate: false,
			hasOpenCart: false,
		};
	},
	mutations: {},
	actions: {},
});
