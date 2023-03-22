import axios from "../axios";
import BaseApi from "@/apis/base-api";
class AdminProductApi extends BaseApi {
	constructor() {
		super();
		this.controller = "";
		this.localStorageKey = "cart";
	}

	getBySlug(slug) {
		return axios.get(`${this.controller}/by-slug/${slug}`);
	}

	//#region Local storage
	addItemToCart(item) {
		try {
			const cart = this.getCart();

			const index = cart.findIndex((x) => x.id == item.id);
			if (index != -1) {
				const existingItem = cart[index];
				existingItem.quantity = existingItem.quantity + 1;
				cart.splice(index, 1, existingItem);
				this.updateCart(cart);
				return true;
			}

			cart.push(item);
			this.updateCart(cart);
			return true;
		} catch (error) {
			return false;
		}
	}

	clearCart() {
		try {
			localStorage.removeItem(this.localStorageKey);
			return true;
		} catch (error) {
			return false;
		}
	}

	getCart() {
		const localCartString = localStorage.getItem(this.localStorageKey);
		if (localCartString) {
			const localCart = JSON.parse(localCartString);
			if (Array.isArray(localCart)) return localCart;
			return [];
		}
		return [];
	}

	removeItemFromCart(item) {
		if (item) {
			const cart = this.getCart();
			const index = cart.findIndex((x) => x.id == item.id);
			cart.splice(index, 1);
			const updatedSuccessfully = this.updateCart(cart);
			if (updatedSuccessfully) {
				return true;
			}
			return false;
		}
		return false;
	}

	updateCart(newCart) {
		if (newCart) {
			localStorage.setItem(this.localStorageKey, JSON.stringify(newCart));
			return true;
		}
		return false;
	}

	updateCartItem(newItem) {
		if (newItem) {
			const cart = this.getCart();
			const index = cart.findIndex((x) => x.id == newItem.id);
			cart.splice(index, 1, newItem);
			return this.updateCart(cart);
		}
		return false;
	}

	// getCartPrice() {
	// 	const cart = this.getCart();
	// 	let total = 0;
	// 	for (let i = 0; i < cart.length; i++) {
	// 		total += cart[i].price * cart[i].quantity; // * voi discount sau
	// 	}
	// 	return total;
	// }
	//#endregion
}

export default new AdminProductApi();
