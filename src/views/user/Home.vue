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

			<section class="mt-5 best-seller">
				<div class="img-parent mb-3">
					<img
						src="https://file.hstatic.net/200000516983/file/new_arrivals_947bf09a955a44e7bd82cf1fc1238162.jpg"
						alt=""
					/>
				</div>
				<div class="title">Hàng mới về</div>
				<div class="products row row-cols-xl-5 my-5">
					<v-product v-for="product in products" :key="product.id" :item="product"></v-product>
				</div>

				<div class="button-wrapper d-flex justify-content-center"><v-button>Mua ngay</v-button></div>
			</section>

			<section class="mt-5 new-arrival">
				<div class="title">Bán chạy nhất</div>
				<div class="products row row-cols-xl-5 my-5">
					<v-product v-for="product in products" :key="product.id" :item="product"></v-product>
				</div>

				<div class="button-wrapper d-flex justify-content-center"><v-button>Mua ngay</v-button></div>
			</section>

			<section class="mt-5 nice-set">
				<div class="title">Gợi ý các Set đồ năng động có sẵn tại cửa hàng</div>
				<div class="images-content">
					<div class="img-parent">
						<img
							src="https://file.hstatic.net/200000516983/file/kim_hien_3fb06e308ee943a3a866d2dc10acc00f.jpg"
							alt=""
						/>
					</div>
					<div class="img-parent">
						<img
							src="https://file.hstatic.net/200000516983/file/gia_bao_mau_1_d7d413175d2540cb8be5b5114846712b.jpg"
							alt=""
						/>
					</div>
					<div class="img-parent">
						<img
							src="https://file.hstatic.net/200000516983/file/a3bce806d5078dfafa96b1f41b9a47a2_08aa3c31c3ef41f581a4ee1e9ea8737b.jpg"
							alt=""
						/>
					</div>
				</div>
			</section>
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

.nice-set {
	.images-content {
		display: flex;
		gap: 16px;
		.img-parent {
			flex: 1;
		}
	}
}
section > .title {
	margin-top: 32px;

	color: #000000;
	margin: 0 0 13px 0;
	font-weight: 700;
	line-height: 1.2;
	font-size: 24px;
}
</style>
