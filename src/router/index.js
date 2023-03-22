import { createRouter, createWebHistory } from "vue-router";
import TheUserLayout from "@/layout/user/the-user-layout/TheUserLayout.vue";
import Home from "@/views/user/Home.vue";
import ProductList from "@/views/user/ProductList.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";
import CartDetail from "@/views/user/CartDetail.vue";
import Checkout from "@/views/user/Checkout.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		// user routes
		{
			path: "/",
			redirect: "/home",
			name: "user root path",
			component: TheUserLayout,
			children: [
				{ path: "home", name: "home page", component: Home },
				{ path: "product-list/:type", name: "product list", component: ProductList },
				{ path: "product-detail/:slug", name: "product detail", component: ProductDetail },
				{ path: "cart-detail", name: "cart detail", component: CartDetail },
				{ path: "checkout", name: "checkout", component: Checkout },
			],
		},
		// admin routes
		// {
		// 	path: "/admin",
		// 	name: "admin root path",
		// 	component: () => import("../views/AboutView.vue"),
		// },
	],
});

export default router;
