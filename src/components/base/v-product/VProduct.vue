<template>
	<div class="product col-6 col-md-4 col-lg-3">
		<router-link class="wrapper" :to="'/product-detail/' + item?.slug">
			<div class="img-parent">
				<img
					:src="'data:image/jpeg;base64,' + item?.images[0]?.content"
					class="product-image"
					alt="hình ảnh sản phẩm"
				/>
			</div>
			<div class="product-detail">
				<div class="product-detail-brand">{{ item?.brand?.name }}</div>
				<div class="product-detail-name">{{ item?.name }}</div>
				<div class="product-detail-price">{{ getCurrencyFormat(item?.price) }}</div>
			</div>
		</router-link>
	</div>
</template>

<script>
import { getCurrencyFormat } from "@/helpers/common-helpers";
export default {
	components: {},
	data() {
		return {
			getCurrencyFormat,
		};
	},
	props: {
		item: {
			type: Object,
			default: null,
		},
	},
	computed: {},
	methods: {},
};
</script>

<style scoped lang="scss">
.product {
	padding-left: 6px;
	padding-right: 6px;
	.wrapper {
		background: var(--color-product-background);
		display: flex;
		flex-direction: column;

		.img-parent {
			height: 238px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.product-image {
			cursor: pointer;
		}

		.product-detail {
			padding: 8px;
			.product-detail-brand {
				text-transform: uppercase;
				font-size: 0.8rem;
			}
			.product-detail-name {
				font-weight: 500;
				margin-top: 6px;
			}
			.product-detail-price {
				margin-top: 40px;
				font-weight: bold;
				margin-bottom: 6px;
			}
		}
	}
}
</style>
