<template>
	<div id="theAdminSidebar" :class="['sidebar-item', { on: isVisible }]">
		<ul class="sidebar-items">
			<div v-for="(item, index) in sidebarItems" :key="index" class="sidebar-item" :title="item.text">
				<router-link :to="item.to">{{ item.text }}</router-link>
			</div>
		</ul>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			sidebarItems: [
				{
					text: "Dashboard",
					to: "/admin/dashboard",
				},
				{
					text: "Quản lý sản phẩm",
					to: "/admin/product",
				},
				{
					text: "Quản lý đơn hàng",
					to: "/admin/order",
				},
				{
					text: "Quản lý kho",
					to: "/admin/inventory",
				},
				{
					text: "Quản lý người dùng",
					to: "/admin/user",
				},
			],
		};
	},
	props: {
		isVisible: {
			type: Boolean,
			default: true,
		},
	},
	computed: {},
	methods: {},
};
</script>

<style scoped lang="scss">
#theAdminSidebar {
	transition: all 0.35s ease-in-out;
	background: #333;
	width: 0;
	height: calc(100vh - 48px);

	&.on {
		width: 250px;
		* {
			visibility: visible;
		}
	}
}

.sidebar-items {
	visibility: hidden;
	padding-top: 60px;
	.sidebar-item {
		> a {
			padding: 16px 40px 16px 40px;
			color: rgb(221, 221, 221);
			display: block;
			font-size: 1.1rem;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
	}
}
</style>
