<template>
	<!-- header  -->
	<the-header></the-header>
	<!-- main content  -->
	<router-view />
	<!-- footer -->
	<the-footer></the-footer>
</template>
<script>
import TheFooter from "@/layout/user/the-footer/TheFooter.vue";
import TheHeader from "@/layout/user/the-header/TheHeader.vue";

export default {
	components: { TheFooter, TheHeader },
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
	methods: {},
};
</script>

<style scoped></style>
