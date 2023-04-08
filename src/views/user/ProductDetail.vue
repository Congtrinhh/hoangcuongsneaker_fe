<template>
	<div class="" id="productDetailComponent">
		<div class="container">
			<!-- breadcrumb -->
			<div class="breadcrumb">
				<span>Trang chủ</span>
				/
				<span>Sản phẩm</span>
				/
				<span>{{ product?.name }}</span>
			</div>

			<!-- product detail -->
			<div class="product-detail row">
				<div class="col col-xl-6 images-wrapper">
					<dx-gallery
						id="gallery"
						:data-source="dataSource"
						:loop="loop"
						:slideshow-delay="slideshowDelay"
						:show-nav-buttons="showNavButtons"
						:show-indicator="showIndicator"
						:height="'50vh'"
					></dx-gallery>
				</div>
				<div class="col col-xl-6 detail-wrapper">
					<div class="name">{{ product?.name }}</div>
					<div class="brand-name">Thương hiệu: {{ product?.brand?.name }}</div>
					<div class="price-wrapper">
						<div class="old-price">{{ product?.price }}</div>
						<div class="now-price">{{ product?.price }}</div>
					</div>
					<div class="size-wrapper">
						<div class="size-title">Chọn size:</div>
						<dx-radio-group
							:items="sizes"
							:value="selectedSize"
							display-expr="name"
							layout="horizontal"
							@value-changed="handleSizeOptionChange"
						/>
					</div>
					<div class="color-wrapper">
						<div class="color-title">Chọn màu:</div>
						<dx-radio-group
							:items="colors"
							display-expr="name"
							layout="horizontal"
							@value-changed="handleColorOptionChange"
							ref="radioGroupColor"
						/>
					</div>
					<div class="promotion-wrapper">
						<div class="promotion">sản phẩm chính hãng, bao check 100%</div>
					</div>
					<div class="add-to-cart-wrapper">
						<v-button class="btn-add-to-cart w-full" @click="handleAddToCart()">Thêm hàng vào giỏ</v-button>
					</div>
				</div>
			</div>

			<!-- related products -->
		</div>
	</div>
</template>

<script>
import DxGallery from "devextreme-vue/gallery";
import Product from "@/models/product";
import AdminProductApi from "@/apis/admin/admin-product-api";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import DxRadioGroup from "devextreme-vue/radio-group";
import CartApi from "@/apis/user/cart-api";
import { useCartStore } from "@/stores/cart";

export default {
	components: { DxGallery, DxRadioGroup },
	data() {
		return {
			productApi: AdminProductApi,
			product: new Product(),

			// #slider images
			sliderImages: [],
			loop: true,
			slideshowDelay: 5000,
			showNavButtons: true,
			showIndicator: true,
			dataSource: new CustomStore({
				load: (loadOptions) => {
					const slug = this.$route.params.slug;

					this.productApi
						.getBySlug(slug)
						.then((res) => {
							if (res.data.isSuccessful) {
								this.product = res.data.data[0];
								let product = res.data.data[0];

								this.selectedSize = this.product?.productInventories[0].size;
								this.sizes = this.product?.productInventories?.map((p) => p.size);
								this.colors = this.product?.productInventories
									?.map((p) => {
										if (p.size.id == this.selectedSize.id) {
											return p.color;
										}
										return null;
									})
									.filter((x) => x != null);

								const imageContents = product.images.map((image) => {
									const imageContent = "data:image/jpeg;base64," + image?.content;
									return imageContent;
								});

								const galleryResponse = {
									data: imageContents,
									totalCount: imageContents.length,
								};
								return galleryResponse;
							}
						})
						.catch((err) => {
							console.log(err);
						});
				},
			}),
			// #end
			selectedSize: null,
			selectedColor: null,
			sizes: [],
			colors: [],
			selectedProductInventory: null,

			cartApi: CartApi,
			hasUpdateCart: false,

			cartStore: useCartStore(),
		};
	},
	computed: {},
	methods: {
		/**
		 * Good code need least explanation!!
		 * @param {*} slug
		 */
		async getProduct(slug) {
			try {
				let store = new CustomStore({
					loadMode: "processed",
					load: () => {
						this.productApi
							.getBySlug(slug)
							.then((res) => {
								if (res.data.isSuccessful) {
									this.product = res.data.data[0];
									let product = res.data.data[0];
									const imageContents = product.images.map((image) => {
										const imageContent = "data:image/jpeg;base64," + image?.content;
										return imageContent;
									});

									const galleryResponse = {
										data: imageContents,
									};
									return galleryResponse;
								}
							})
							.catch((err) => {
								console.log(err);
							});
					},
				});

				this.dataSource = new DataSource({
					store: store,
					map: function (item) {
						console.log(item);
						return item;
						// var imageBase64 =
						// 	"data:image/png;base64," + new CameraApp.WorkOrderPictureViewModel(item).PictureImage();
						// return imageBase64;
					},
				});

				// const res = await this.productApi.getBySlug(slug);
				// if (res.data.isSuccessful && res.data.data?.length) {
				// 	this.product = res.data.data[0];

				// 	this.setUpSlider();
				// 	// notify success
				// } else {
				// }
			} catch (error) {
				// notify error
			}
		},
		setUpSlider() {
			this.sliderImages = this.product.images.map((image) => image.content);
		},
		handleSizeOptionChange(e) {
			this.selectedProductInventory = null;
			this.selectedSize = e.value;
			this.$refs.radioGroupColor.EditValue = null;

			// get colors by size
			this.colors = this.product?.productInventories
				?.map((p) => {
					if (p.size.id == this.selectedSize.id) {
						return p.color;
					}
					return null;
				})
				.filter((x) => x != null);

			// get product inventory by size and color selected
			if (!this.selectedColor) {
				return;
			}

			const productInventory = this.product.productInventories?.find(
				(p) => p.size?.id == this.selectedSize?.id && p.color?.id == this.selectedColor?.id
			);
			if (productInventory?.quantity <= 0) {
				// show error
				console.log("sp nay da het");
			} else {
				this.selectedProductInventory = productInventory;
			}
		},
		handleColorOptionChange(e) {
			this.selectedColor = e.value;
			// get product inventory by size and color selected
			const productInventory = this.product.productInventories?.find(
				(p) => p.size?.id == this.selectedSize?.id && p.color?.id == this.selectedColor?.id
			);

			if (productInventory?.quantity <= 0) {
				// show error
				console.log("sp nay da het");
			} else {
				this.selectedProductInventory = productInventory;
			}
		},
		handleAddToCart() {
			debugger;
			if (!this.selectedProductInventory || !this.selectedProductInventory.id) {
				console.log("No product inventory found");
				return;
			}
			this.processSelectedProductInventory();
			const isSuccessful = this.cartApi.addItemToCart(this.selectedProductInventory);
			if (isSuccessful) {
				console.log("Add item to cart successfully");
				this.cartStore.hasUpdate = true;
				this.cartStore.hasOpenCart = true;
			} else {
				console.log("Add item to cart failed");
			}
		},
		processSelectedProductInventory() {
			this.selectedProductInventory.quantity = 1;
			const image = this.product?.images[0]?.content;
			this.selectedProductInventory.image = image;
		},
	},
	async mounted() {
		const slug = this.$route.params.slug;
		// await this.getProduct(slug);
	},
};
</script>

<style scoped lang="scss">
#productDetailComponent {
	background: #f5f8fd;
	.container {
	}
}

.product-detail {
	.detail-wrapper {
		background: #fff;
		border-radius: 8px;
		padding: 0 15px;

		.name {
			margin-top: 20px;
			margin-bottom: 8px;
		}
		.brand-name {
		}
		.price-wrapper {
			margin: 15px 0;
		}
		.promotion-wrapper {
			display: flex;
			flex-direction: column;
			.promotion {
				background: rgba(236, 235, 232, 0.65);
				padding: 15px;
				text-align: center;
				font-weight: bold;
				display: -ms-flexbox;
				display: flex;
				-ms-flex-align: center;
				align-items: center;
				-ms-flex-pack: center;
				justify-content: center;
			}
		}

		.btn-add-to-cart {
			margin-top: 20px;
		}

		.size-wrapper {
			margin-bottom: 12px;
			.size-title {
				margin-bottom: 8px;
			}
		}
		.color-wrapper {
			margin-bottom: 12px;
			.color-title {
				margin-bottom: 8px;
			}
		}
	}
}

.breadcrumb {
	margin: 10px 0;
	font-size: 0.9px;
}

.w-full {
	width: 100%;
}
</style>
