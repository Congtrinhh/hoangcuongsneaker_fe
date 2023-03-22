<template>
	<button :class="['v-button', { 'icon-only': hasIconOnly, 'text-only': hasTextOnly }]">
		<slot
			><span class="v-button-icon"> </span>
			<div class="v-button-text">{{ text }}</div></slot
		>
	</button>
</template>

<script>
export default {
	data() {
		return {
			color: "green",
		};
	},
	props: {
		text: {
			type: String,
			default: "button content",
		},
		type: {
			type: String,
			default: "primary",
		},
		hasIconOnly: {
			type: Boolean,
		},
		hasTextOnly: {
			type: Boolean,
		},
		iconSize: {
			type: Number,
			default: 20,
		},
	},
	computed: {},
	methods: {},
};
</script>

<style scoped lang="scss">
.v-button {
	position: relative;
	display: inline-block;
	z-index: 1;
	overflow: hidden;
	padding: 12px 28px;
	line-height: normal;
	color: #fff;
	background-color: #8b572a;
	border: 1px solid #252a2b;
	font-size: 13px;
	font-weight: 500;
	text-align: center;
	letter-spacing: 1px;
	outline: none;
	border-radius: 2px;
	text-transform: uppercase;
	-webkit-transition: color 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86),
		border 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
	transition: color 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86), border 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
	cursor: pointer;

	&::before {
		content: "";
		display: block;
		background-color: #252a2b;
		position: absolute;
		left: -2px;
		top: 0;
		right: -2px;
		bottom: 0;
		z-index: -1;
		-webkit-transform: scale(1, 1);
		transform: scale(1, 1);
		-webkit-transform-origin: left center;
		transform-origin: left center;
		-webkit-transition: -webkit-transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
		transition: -webkit-transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
		transition: transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
		transition: transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86),
			-webkit-transform 0.45s cubic-bezier(0.785, 0.135, 0.15, 0.86);
	}
	&:hover,
	&:focus {
		border-color: #8b572a;
		color: #ffffff;
	}

	&:hover::before,
	&:focus::before {
		-webkit-transform-origin: right center;
		transform-origin: right center;
		-webkit-transform: scale(0, 1);
		transform: scale(0, 1);
	}
}

.v-button .v-button-text {
	font-size: 0.9rem;
}

.v-button.icon-only .v-button-text {
	display: none;
}

.v-button.text-only .v-button-icon {
	display: none;
}
</style>
