<template>
	<div id="main-content">
		<div class="container">
			<dx-gallery
				id="gallery"
				:data-source="sliderImages"
				:loop="loop"
				:slideshow-delay="slideshowDelay"
				:show-nav-buttons="showNavButtons"
				:show-indicator="showIndicator"
				:height="'50vh'"
			></dx-gallery>

			<v-button>Mua ngay</v-button>

			<div class="products row row-cols-xl-5">
				<v-product v-for="product in products" :key="product.id" :item="product"></v-product>
			</div>
		</div>
	</div>
</template>

<script>
import DxGallery from "devextreme-vue/gallery";
import BaseApi from "@/apis/base-api";
export default {
	components: { DxGallery },
	data() {
		return {
			// #slider images
			sliderImages: [
				"https://api.lorem.space/image/movie?w=1140",
				"https://api.lorem.space/image/movie?w=1139",
				"https://api.lorem.space/image/movie?w=1138",
			],
			loop: true,
			slideshowDelay: 5000,
			showNavButtons: true,
			showIndicator: true,
			// #end
			productApi: new BaseApi("AdminProducts"),
			products: [],
		};
	},
	props: {},
	async mounted() {
		try {
			const res = await this.productApi.getAll();
			if (res.data.isSuccessful) {
				this.products = res.data.data;
			} else {
				// notify error
			}
		} catch (error) {
			// notify error
		}
	},
	computed: {},
	methods: {},
};
</script>

<style scoped lang="scss">
#main-content {
	background: var(--color-main-content-background);
}
.product {
	padding-left: 12px;
	padding-right: 12px;
	.wrapper {
		background: var(--color-product-background);
		display: flex;
		flex-direction: column;

		.product-image {
			cursor: pointer;
		}

		.product-detail {
			padding: 8px;
			.product-detail-brand {
				text-transform: uppercase;
				font-size: 0.9rem;
			}
			.product-detail-name {
			}
			.product-detail-price {
				margin-top: 40px;
				font-weight: bold;
				&::after {
					content: "d";
				}
			}
		}
	}
}
</style>
