<template>
	<!-- key: fullPath: khi 1 component với cùng 1 route, chỉ khác param đằng sau thì component vẫn được rerender -->
	<RouterView :key="$route.fullPath" />
</template>
<script>
import { useIndexStore } from "@/stores";

export default {
	data() {
		return {};
	},
	watch: {},
	methods: {},
	/**
	 * mỗi khi reload lại website,
	 * setup thông tin người dùng nếu người dùng đã đăng nhập
	 */
	mounted() {
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			useIndexStore.isLoggedIn = true;
			useIndexStore.userInfo = JSON.parse(userInfo);
		} else {
			useIndexStore.isLoggedIn = false;
		}
	},
};
</script>

<style scoped></style>
