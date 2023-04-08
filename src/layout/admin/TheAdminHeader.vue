<template>
	<div id="theAdminHeader">
		<div class="left">
			<div class="logo-wrapper">Hoangcuongsneaker</div>
			<div class="toggle-wrapper" @click="toggleSizeBar">
				<i :class="isVisibleSideBar ? 'fa-sharp fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
			</div>
		</div>
		<v-account-popover></v-account-popover>
	</div>
</template>

<script>
import VAccountPopover from "@/components/user/v-account-popover/VAccountPopover.vue";

export default {
	components: { VAccountPopover },
	data() {
		return {
			color: "green",
		};
	},
	props: {
		pColor: {
			type: String,
			default: "black",
		},
	},
	computed: {},
	methods: {
		toggleSizeBar() {
			this.$emit("toggleSidebar");
		},
	},
};
</script>

<style scoped lang="scss">
#theAdminHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px 12px;
	background: #fff;
	height: 48px;
	max-height: 48px;

	> .left {
		display: flex;
		align-items: center;
		gap: 20px;
	}
}

.logo-wrapper {
	font-size: 1.5rem;
	font-weight: 600;
}
.collapse-wrapper {
}
.account-wrapper {
}
</style>
