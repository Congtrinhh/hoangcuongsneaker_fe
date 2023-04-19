<template>
	<div class="" id="productDetailComponent">
		<div class="container">
			<!-- breadcrumb -->
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><router-link to="/home">Trang chủ</router-link></li>
					<li class="breadcrumb-item"><a href="#">Sản phẩm</a></li>
					<li class="breadcrumb-item active" aria-current="page">{{ product?.name }}</li>
				</ol>
			</nav>

			<!-- product detail -->
			<div class="product-detail row">
				<div class="col col-12 col-lg-6 images-wrapper">
					<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
						<div class="carousel-indicators">
							<button
								v-for="(image, index) in product.images"
								:key="index"
								type="button"
								data-bs-target="#carouselExampleIndicators"
								:data-bs-slide-to="index"
								:class="index == 0 ? 'active' : ''"
								:aria-current="index == 0 ? true : false"
								:aria-label="'slide' + index"
							></button>
						</div>
						<div class="carousel-inner">
							<div class="carousel-item active" v-for="(image, index) in product.images" :key="index">
								<img
									:src="'data:image/jpeg;base64,' + image.content"
									class="d-block w-100"
									:alt="image.desc"
								/>
							</div>
						</div>
						<button
							class="carousel-control-prev"
							type="button"
							data-bs-target="#carouselExampleIndicators"
							data-bs-slide="prev"
						>
							<span class="carousel-control-prev-icon" aria-hidden="true"></span>
							<span class="visually-hidden">Previous</span>
						</button>
						<button
							class="carousel-control-next"
							type="button"
							data-bs-target="#carouselExampleIndicators"
							data-bs-slide="next"
						>
							<span class="carousel-control-next-icon" aria-hidden="true"></span>
							<span class="visually-hidden">Next</span>
						</button>
					</div>
				</div>
				<div class="col col-12 col-lg-6 detail-wrapper">
					<div class="name">{{ product?.name }}</div>
					<div class="brand-name">Thương hiệu: {{ product?.brand?.name }}</div>
					<div class="price-wrapper">
						<!-- <div class="old-price">{{ getCurrencyFormat(product?.price) }}</div> -->
						<div class="now-price">{{ getCurrencyFormat(product?.price) }}</div>
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

					<!-- error message -->
					<div class="error" v-show="errorMessage">{{ errorMessage }}</div>

					<div class="promotion-wrapper">
						<div class="promotion">sản phẩm chính hãng, bao check 100%</div>
					</div>
					<div class="add-to-cart-wrapper">
						<v-button class="btn-add-to-cart w-full" @click="handleAddToCart()">Thêm hàng vào giỏ</v-button>
					</div>

					<!-- mô tả sản phẩm -->
					<div class="product-description">
						<div class="description-title">
							Thông tin sản phẩm
							<button
								type="button"
								style="float: right"
								data-bs-toggle="collapse"
								data-bs-target="#collapseExample"
								aria-expanded="false"
								aria-controls="collapseExample"
							>
								+
							</button>
						</div>
						<div class="collapse description-content" id="collapseExample">
							<div class="panel-description">
								<div class="description-productdetail typeList-style">
									<p>
										<strong
											><img
												alt="⭐️"
												height="16"
												width="16"
												src="https://static.xx.fbcdn.net/images/emoji.php/v9/t35/2/16/2b50.png"
											/>Hàng chính hãng bao check 100%</strong
										>
									</p>
									<p>
										<strong
											><img
												alt="⭐️"
												height="16"
												width="16"
												src="https://static.xx.fbcdn.net/images/emoji.php/v9/t35/2/16/2b50.png"
											/>Hỗ trợ cod toàn quốc</strong
										>
									</p>
								</div>
							</div>
							<div style="font-weight: 500; line-height: 1.6rem">{{ product?.description }}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- related products -->
			<section class="relevant-product-section">
				<div class="section-title">Sản phẩm liên quan</div>
				<div class="relevant-products row row-cols-xl-5">
					<v-product
						v-for="product in relevantProducts"
						:key="product.id"
						:item="product"
						class="mb-3"
					></v-product>
				</div>
			</section>
		</div>
	</div>
</template>

<script>
import DxGallery from "devextreme-vue/gallery";
import Product from "@/models/product";
import AdminProductApi from "@/apis/admin/admin-product-api";
import DxRadioGroup from "devextreme-vue/radio-group";
import CartApi from "@/apis/user/cart-api";
import { useCartStore } from "@/stores/cart";
import { getCurrencyFormat } from "@/helpers/common-helpers";

export default {
	components: { DxGallery, DxRadioGroup },
	data() {
		return {
			productApi: AdminProductApi,
			product: new Product(),

			selectedSize: null,
			selectedColor: null,
			sizes: [],
			colors: [],
			selectedProductInventory: null,

			cartApi: CartApi,
			hasUpdateCart: false,

			cartStore: useCartStore(),

			getCurrencyFormat,
			errorMessage: "",
			relevantProducts: [],
		};
	},
	computed: {},
	methods: {
		/**
		 * Good code need least explanation!!
		 * @param {*} slug
		 */
		getProduct(slug) {
			try {
				this.productApi
					.getBySlug(slug)
					.then((res) => {
						if (res.data.isSuccessful) {
							this.product = res.data.data[0];

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

							this.getRelevantProducts(this.product);
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} catch (error) {
				this.$showError();
			}
		},
		setUpSlider() {
			this.sliderImages = this.product.images.map((image) => image.content);
		},
		handleSizeOptionChange(e) {
			this.selectedProductInventory = null;
			this.selectedSize = e.value;
			this.$refs.radioGroupColor.instance.option("value", null);
			this.selectedColor = null;

			// this.$refs.radioGroupColor.EditValue = null;

			// get colors by size
			this.colors = this.product?.productInventories
				?.map((p) => {
					if (p.size.id == this.selectedSize.id) return p.color;
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
			this.errorMessage = "";
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
			if (!this.selectedProductInventory || !this.selectedProductInventory.id) {
				console.log("No product inventory found");
				this.errorMessage = "Vui lòng chọn màu và size";
				return;
			}
			this.errorMessage = "";

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
		/**
		 * get danh sach san pham lien quan
		 */
		getRelevantProducts(product = {}) {
			let pagingRequest = {
				pageIndex: 0,
				pageSize: 5,
				isActive: true,
				brandIds: [product.brand?.id],
			};
			this.productApi
				.getPaging(pagingRequest)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.relevantProducts = res.data.data[0].items;
					} else this.$showError();
				})
				.catch((err) => this.$showError());
		},
	},
	mounted() {
		const slug = this.$route.params.slug;
		this.getProduct(slug);
	},
};
</script>

<style scoped lang="scss">
#productDetailComponent {
	background: #f5f8fd;
	padding: 16px 0 30px;

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
			font-weight: 700;
			font-size: 20px;
		}
		.brand-name {
		}
		.price-wrapper {
			margin: 15px 0;

			.old-price,
			.now-price {
				font-size: 25px;
				font-weight: 600;
				color: red;
			}
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

.w-full {
	width: 100%;
}

#carouselExampleIndicators {
	height: 40vh;
}

.product-description {
	margin: 24px 0 16px;
	.description-title {
		font-size: 15px;
		font-weight: 700;
		text-transform: uppercase;
		padding: 20px 0;
	}
}

.relevant-product-section {
	margin-top: 60px;
}
.section-title {
	margin: 0 0 20px;
	font-size: 28px;
	text-align: center;
	font-weight: 700;
	font-size: 28px;
}

// Bootstrap carousel
.carousel-control-prev-icon,
.carousel-control-next-icon {
	background-color: #9f9595;
	border-radius: 50%;
}
.carousel-indicators {
	background-color: #d3cbcb;
}
// Responsive
@media screen and (min-width: 576px) {
	#carouselExampleIndicators {
		height: 60vh;
	}
}
@media screen and (min-width: 768px) {
	#carouselExampleIndicators {
		height: 75vh;
	}
}
@media screen and (min-width: 992px) {
	#carouselExampleIndicators {
		height: unset;
	}
}
//
</style>
