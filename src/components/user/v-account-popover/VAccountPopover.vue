<template>
	<div class="account-wrapper" id="accountPopoverComponent">
		<div v-if="useIndexStore.isLoggedIn == true" class="general-info" @click="handleToggle" title="Tài khoản">
			<div v-if="useIndexStore.userInfo?.role == 'user'">
				<font-awesome-icon icon="fa-regular fa-user" size="lg" />
			</div>
			<div v-else>Tài khoản</div>
		</div>
		<div v-else class="general-info" @click="toLoginPage" title="Tài khoản">
			<font-awesome-icon icon="fa-regular fa-user" size="lg" />
		</div>

		<dx-popover
			:width="260"
			:visible="isVisible"
			:target="target"
			:position="position"
			:show-title="true"
			@hiding="handlePopoverHiding"
		>
			<template #title>
				<div class="popover-header">{{ title }}</div>
			</template>
			<template #content>
				<div class="header"></div>
				<div class="list-option">
					<div v-if="useIndexStore.userInfo?.role == 'user'">
						<router-link class="" to="user-account"> Tài khoản của tôi </router-link>
						<router-link to="" @click="handleLogout"> Đăng xuất </router-link>
					</div>
					<div v-else>
						<router-link to="" @click="handleLogout"> Đăng xuất </router-link>
					</div>
				</div>
			</template>
		</dx-popover>
	</div>
</template>

<script>
import { DxPopover } from "devextreme-vue/popover";
import { useIndexStore } from "@/stores";
import AuthenticationApi from "@/apis/authentication-api";

export default {
	components: { DxPopover },
	data() {
		return {
			// loggedInOptions: [
			// 	{ text: "Tài khoản của tôi", to: "/user-account" },
			// 	{ text: "Đăng xuất", to: "/logout", onClickHandler: this.handleLogout },
			// ],
			isVisible: false,
			useIndexStore,
		};
	},
	props: {
		target: {
			type: String,
			default: ".account-wrapper",
		},
		position: {
			type: [String, Object],
			default: {
				my: "top",
				at: "bottom",
				offset: "0 10",
			},
		},
		title: {
			type: String,
			default: "Thông tin tài khoản",
		},
	},
	computed: {},
	methods: {
		/**
		 * xu ly dang xuat nguoi dung khoi he thong
		 */
		handleLogout() {
			try {
				AuthenticationApi.doLogout();
				this.isVisible = false;
				this.$router.push({ name: this.$routeNameEnum.Home });
				this.$showSuccess("Đăng xuất thành công");
			} catch (error) {
				this.$showError();
			}
		},
		handlePopoverHiding() {
			this.isVisible = false;
		},
		handleToggle() {
			this.isVisible = !this.isVisible;
		},
		toLoginPage() {
			this.$router.push({ name: this.$routeNameEnum.Login });
		},
	},
};
</script>

<style scoped lang="scss">
#accountPopoverComponent {
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
.popover-header {
	text-transform: uppercase;
	text-align: center;
}

.list-option {
	display: flex;
	flex-direction: column;
	row-gap: 6px;
	> a:hover {
		text-decoration: underline;
	}
}

.font-weight-500 {
	font-weight: 500;
}
</style>
