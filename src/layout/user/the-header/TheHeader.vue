<template>
	<div class="the-header">
		<div class="container">
			<router-link to="/" class="logo-wrapper">
				<img
					src="https://file.hstatic.net/200000516983/file/image-removebg-preview__10__e0781e41cc3a4626bc415380cfa0cb61.png"
					class="logo"
				/>
			</router-link>

			<ul class="nav-wrapper">
				<li v-for="item in navItems" :key="item.text" class="nav-item">
					<router-link :to="item.link">{{ item.text }}</router-link>
				</li>
			</ul>

			<div class="icons-wrapper">
				<v-search-box initialSearchKey="" />
				<v-account-popover></v-account-popover>
				<v-cart></v-cart>
			</div>
		</div>
	</div>
</template>

<script>
import VCart from "@/components/user/v-cart/VCart.vue";
import VAccountPopover from "@/components/user/v-account-popover/VAccountPopover.vue";
export default {
	components: { VCart, VAccountPopover },
	data() {
		return {
			navItems: [
				{
					text: "Nam",
					link: "/product-list/men",
				},
				{
					text: "Nữ",
					link: "/product-list/women",
				},
				{
					text: "Unisex",
					link: "/product-list/unisex",
				},
			],
		};
	},
	props: {},
	computed: {},
	methods: {},
};
</script>
<style scoped lang="scss">
.the-header {
	background: var(--color-header-background);
	border-bottom: 1px solid var(--color-header-border);
}
.the-header .container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.logo-wrapper {
	cursor: pointer;
	width: 60px;
	.logo {
	}
}
.nav-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 40px;
	.nav-item {
	}
}
.icons-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 60px;
}

.search-wrapper {
}
.account-wrapper {
	cursor: pointer;
	.general-info {
		position: relative;

		img {
			position: absolute;
			width: 16px;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
		}
	}
}
</style>
