import { createRouter, createWebHistory } from "vue-router";
import TheUserLayout from "@/layout/user/the-user-layout/TheUserLayout.vue";
import TheAdminLayout from "@/layout/admin/TheAdminLayout.vue";
import Home from "@/views/user/Home.vue";
import ProductList from "@/views/user/ProductList.vue";
import ProductDetail from "@/views/user/ProductDetail.vue";
import CartDetail from "@/views/user/CartDetail.vue";
import Checkout from "@/views/user/Checkout.vue";
import UserAccount from "@/views/user/UserAccount.vue";
import Login from "@/views/Login.vue";
import Registration from "@/views/Registration.vue";
import DashBoard from "@/views/admin/DashBoard.vue";
import AdminProductList from "@/views/admin/AdminProductList.vue";
import AdminProductDetail from "@/views/admin/AdminProductDetail.vue";
import AdminOrderList from "@/views/admin/AdminOrderList.vue";
import AdminOrderDetail from "@/views/admin/AdminOrderDetail.vue";
import AdminUserList from "@/views/admin/AdminUserList.vue";
import AdminUserDetail from "@/views/admin/AdminUserDetail.vue";
import AdminInventoryList from "@/views/admin/AdminInventoryList.vue";
import AdminInventoryDetail from "@/views/admin/AdminInventoryDetail.vue";
import { RouteNameEnum } from "@/enums/route-name-enum";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		// user routes
		{
			path: "/",
			redirect: "/home",
			name: RouteNameEnum.UserRootPage,
			component: TheUserLayout,
			children: [
				{ path: "home", name: RouteNameEnum.Home, component: Home },
				{ path: "product-list/:gender", name: RouteNameEnum.ProductList, component: ProductList },
				{ path: "product-detail/:slug", name: RouteNameEnum.ProductDetail, component: ProductDetail },
				{ path: "cart-detail", name: RouteNameEnum.CartDetail, component: CartDetail },
				{ path: "user-account", name: RouteNameEnum.UserAccount, component: UserAccount },
			],
		},
		// admin routes
		{
			path: "/admin",
			redirect: "/admin/dashboard",
			name: RouteNameEnum.AdminRootPage,
			component: TheAdminLayout,
			children: [
				{ path: "dashboard", name: RouteNameEnum.AdminDashBoard, component: DashBoard },
				{ path: "product", name: RouteNameEnum.AdminProductList, component: AdminProductList },
				{ path: "product/:id", name: RouteNameEnum.AdminProductDetail, component: AdminProductDetail },
				{ path: "user", name: RouteNameEnum.AdminUserList, component: AdminUserList },
				{ path: "user/:id", name: RouteNameEnum.AdminUserDetail, component: AdminUserDetail },
				{ path: "order", name: RouteNameEnum.AdminOrderList, component: AdminOrderList },
				{ path: "order/:id", name: RouteNameEnum.AdminOrderDetail, component: AdminOrderDetail },
				{ path: "inventory", name: RouteNameEnum.AdminInventoryList, component: AdminInventoryList }, // manage supply product
				{
					path: "inventory/:id",
					name: RouteNameEnum.AdminInventoryDetail,
					component: AdminInventoryDetail,
				},
			],
		},
		{ path: "/checkout", name: RouteNameEnum.Checkout, component: Checkout },
		{ path: "/login", name: RouteNameEnum.Login, component: Login },
		{ path: "/registration", name: RouteNameEnum.Registration, component: Registration },
	],
});

export default router;
