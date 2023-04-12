<template>
	<div class="the-header">
		<div class="container">
			<!-- navigation for mobile -->
			<div :class="['nav-mobile-wrapper', { on: isVisibleSideBar }]">
				<div class="toggle-icon-wrapper img-parent" @click="toggleSizeBar">
					<i :class="isVisibleSideBar ? 'fa-sharp fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
				</div>
				<ul class="nav">
					<router-link @click="closeSideBar" class="go-to-home-page" to="/">Trang chủ</router-link>
					<li v-for="item in navItems" :key="item.text" class="nav-item">
						<router-link @click="closeSideBar" :to="item.link">{{ item.text }}</router-link>
					</li>
				</ul>
			</div>

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
import { GenderEnum } from "@/enums/gender-enum";

export default {
	components: { VCart, VAccountPopover },
	data() {
		return {
			navItems: [
				{
					text: "Nam",
					link: `/product-list/${GenderEnum.Male}`,
				},
				{
					text: "Nữ",
					link: `/product-list/${GenderEnum.Female}`,
				},
				{
					text: "Unisex",
					link: `/product-list/${GenderEnum.Unisex}`,
				},
			],

			//#region Nav mobile
			isVisibleSideBar: false,
			//#endregion
		};
	},
	props: {},
	computed: {},
	methods: {
		toggleSizeBar() {
			this.isVisibleSideBar = !this.isVisibleSideBar;
		},
		closeSideBar() {
			this.isVisibleSideBar = false;
		},
	},
};
</script>
<style scoped lang="scss">
.the-header {
	background: var(--color-header-background);
	border-bottom: 1px solid var(--color-header-border);
}
.the-header > .container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
}
.logo-wrapper {
	cursor: pointer;
	width: 40px;
	padding: 2px 0;
	margin-right: auto;
}
.nav-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 60px;

	display: none;
}
.icons-wrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
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

// mobile nav
.nav-mobile-wrapper.on {
	height: 100vh;
	width: 80vw;
	z-index: 10;
	top: 0;
	left: 0;
	position: fixed;
	display: block;

	&::after {
		content: "";
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;

		background: rgba(0, 0, 0, 0.65);
	}

	.nav {
		display: flex;
		flex-direction: column;
		background: var(--color-background);

		width: 100%;
		height: 100%;

		padding: 0 16px 16px 16px;
		overflow: auto;

		.go-to-home-page {
			text-align: center;
			color: #999;
			letter-spacing: 2px;
			font-weight: 900;
			background-color: #fff;
			border-style: none;
			cursor: pointer;

			color: #2d2d2d;
			border-bottom: 2px solid #2d2d2d;
			padding: 16px;

			margin-bottom: 24px;
		}

		.nav-item {
			a {
				display: inline-block;
				margin: 16px 0;
				padding: 16px 0;
				font-weight: bold;
				font-size: 16px;
				width: 100%;
			}
		}
	}

	.toggle-icon-wrapper {
		display: inline-block;
		position: absolute;
		top: 6px;
		z-index: 1;
		width: 40px;
		height: 40px;
		background: #333;
		left: 100%;
	}
}

.nav-mobile-wrapper {
	transition: all 0.35s ease;
	margin-right: 10vw;

	.toggle-icon-wrapper {
		display: inline-block;
		cursor: pointer;
		img {
		}
	}
	.nav {
		display: none;
	}
}

//

// Responsive
@media screen and (min-width: 992px) {
	.v-search-box-input {
		display: block;
	}

	.icon-mobile {
		display: none;
	}

	.logo-wrapper {
		width: 48px;
		padding: 6px 0;
	}

	.icons-wrapper {
		gap: 60px;
	}

	.nav-wrapper {
		display: flex;
		margin-right: auto;
		.nav-item {
		}
	}

	.nav-mobile-wrapper {
		display: none;
	}
}

@media screen and (min-width: 1200px) {
	.logo-wrapper {
		width: 56px;
	}
}
//
</style>
