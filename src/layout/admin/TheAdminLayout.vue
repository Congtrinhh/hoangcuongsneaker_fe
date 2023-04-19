<template>
	<div id="theAdminLayout">
		<!-- header  -->
		<div class="top">
			<TheAdminHeader @toggleSidebar="handleToggleSidebar" />
		</div>
		<div class="bottom">
			<!-- sidebar -->
			<TheAdminSidebar :isVisible="isVisibleSideBar" />
			<!-- main content  -->
			<dx-scroll-view height="calc(100vh - 48px)" :elementAttr="{ id: 'theAdminLayoutContent' }">
				<div class="main-content">
					<router-view />
				</div>
			</dx-scroll-view>
		</div>
	</div>
</template>
<script>
import TheAdminHeader from "@/layout/admin/TheAdminHeader.vue";
import TheAdminSidebar from "@/layout/admin/TheAdminSidebar.vue";
import { DxScrollView } from "devextreme-vue/scroll-view";

export default {
	components: { TheAdminHeader, TheAdminSidebar, DxScrollView },
	data() {
		return {
			isVisibleSideBar: true,
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
		handleToggleSidebar() {
			this.isVisibleSideBar = !this.isVisibleSideBar;
		},
	},
};
</script>

<style scoped lang="scss">
#theAdminLayout {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #fbfbfb;
	.bottom {
		display: flex;
	}

	.main-content {
		padding: 12px 20px;
	}
}

#theAdminLayoutContent {
	width: 100%;
}
</style>
