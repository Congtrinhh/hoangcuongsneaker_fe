<template>
	<div class="account-wrapper" id="accountPopoverComponent" @click="handleToggle">
		<div class="general-info">
			<span>Cong trinh</span>
			<img src="@/assets/imgs/icons/angle-down.png" />
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
					<div class="" v-for="item in loggedInOptions" :key="item.id">
						{{ item.text }}
					</div>
				</div>
			</template>
		</dx-popover>
	</div>
</template>

<script>
import { DxPopover } from "devextreme-vue/popover";

export default {
	components: { DxPopover },
	data() {
		return {
			loggedInOptions: [
				{ id: 1, text: "Tài khoản của tôi" },
				{ id: 2, text: "Đăng xuất" },
			],
			isVisible: false,
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
		handlePopoverHiding() {
			this.isVisible = false;
		},
		handleToggle() {
			this.isVisible = !this.isVisible;
		},
	},
};
</script>

<style scoped lang="scss">
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
</style>
