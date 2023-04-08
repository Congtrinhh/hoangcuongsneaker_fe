<template>
	<div class="v-search-box" :style="{ width: width }">
		<input
			type="text"
			name="search-box-input"
			id="searchBoxInput"
			@keyup="handleKeyUp"
			v-model="internalSearchKey"
			class="v-search-box-input"
			:placeholder="placeholder"
		/>
		<button class="v-search-box-button" @click="handleClick">
			<img src="@/assets/imgs/icons/search.png" alt="search icon" />
		</button>

		<img class="icon-mobile" src="@/assets/imgs/icons/search.png" alt="search icon" />
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			internalSearchKey: "",
		};
	},
	props: {
		initialSearchKey: {
			type: String,
			default: "black",
		},
		width: {
			type: String,
			default: "auto",
		},
		placeholder: {
			type: String,
			default: "Tìm kiếm",
		},
	},
	computed: {},
	mounted() {
		this.internalSearchKey = this.initialSearchKey || "";
	},
	methods: {
		handleClick($event) {
			this.$emit("change", this.internalSearchKey);
			console.log(this.internalSearchKey);
		},
		handleKeyUp($event) {
			if ($event.code == "Enter") {
				this.$emit("change", this.internalSearchKey);
				console.log(this.internalSearchKey);
			}
		},
	},
};
</script>

<style scoped lang="scss">
.v-search-box {
	position: relative;
}
.v-search-box-input {
	padding-left: 36px;
	padding-top: 8px;
	padding-bottom: 8px;
	border-radius: 8px;
	border: 1px solid var(--color-input-border);
	outline: transparent;

	display: none;
}
.v-search-box-button {
	position: absolute;
	top: 50%;
	left: 8px;

	background: transparent;
	border: none;
	outline: none;
	transform: translateY(-50%);

	cursor: pointer;

	img {
		width: 16px;
	}
}

.icon-mobile {
	display: inline-block;
}

// Responsive
@media screen and (min-width: 992px) {
	.v-search-box-input {
		display: block;
	}

	.icon-mobile {
		display: none;
	}
}
//
</style>
