<template>
	<div class="" id="checkoutComponent">
		<div class="container">
			<div class="row checkoutComponentContainer">
				<div class="col-12 banner d-block d-lg-none"><h1>HoangCuongSneaker</h1></div>
				<div class="col-12 col-lg-5">
					<div class="cart-info">
						<section class="cart-item-wrapper">
							<div class="cart-item" v-for="cartItem in items" :key="cartItem.id">
								<div class="img-parent">
									<img :src="'data:image/jpeg;base64,' + cartItem.image" alt="" />
									<div class="quantity-counter">{{ cartItem.quantity }}</div>
								</div>
								<div class="cart-detail">
									<div class="cart-detail-child">
										<div class="detail-name">{{ cartItem.name }}</div>
										<div class="detail-size-color">
											<span>{{ cartItem.color?.name }}</span>
											<span>{{ cartItem.size?.name }}</span>
										</div>
									</div>
									<div class="cart-price">{{ getTotalPriceItem(cartItem) }}</div>
								</div>
							</div>
						</section>

						<!-- coupon -->
						<!-- end coupon -->

						<section class="price-calculation">
							<div class="gross-price">
								<div class="title">Tạm tính</div>
								<div class="price"></div>
							</div>
							<div class="shipping-price">
								<div class="title">Phí vận chuyển</div>
								<div class="price"></div>
							</div>
						</section>
						<div class="total-price-conclusion">
							<div class="title">Tổng cộng</div>
							<div class="price price-big">{{ totalPrice }}</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-7">
					<div class="checkout-info">
						<h1 class="website-brand d-none d-lg-block mb-2">HoangCuongSneaker</h1>
						<div class="breadcrumb"><span>Giỏ hàng</span> &gt; <span>Thông tin đơn hàng</span></div>

						<section class="user-info">
							<div class="title">Thông tin đơn hàng</div>

							<div class="logged-in-info">Trinh Cong (trinhquycong@gmail.com) <br />Đăng xuất here</div>

							<!-- name -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Họ tên</label>
								<dx-text-box placeholder="Họ tên" />
							</div>

							<!-- phone -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Số điện thoại</label>
								<!-- <DxTextBox :mask-rules="{ X: /[02-9]/ }" mask="+1 (X00) 000-0000" /> -->
								<DxTextBox placeholder="Số điện thoại" mode="tel" />
							</div>

							<!-- specific address -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Địa ch</label>
								<dx-text-box placeholder="Địa chỉ" />
							</div>
							<!-- 3 select box: province - city - ward -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Tỉnh/thành phố - quận huyện - xã phường</label>
								<div class="address-wrapper">
									<DxSelectBox
										:data-source="provinceDataSource"
										value-expr="id"
										display-expr="name"
										placeholder="Tỉnh"
									/>
									<DxSelectBox
										:data-source="cityDataSource"
										value-expr="id"
										display-expr="name"
										placeholder="Thành phố"
									/>
									<DxSelectBox
										:data-source="wardDataSource"
										value-expr="id"
										display-expr="name"
										placeholder="Quận/huyện/xã"
									/>
								</div>
							</div>
						</section>

						<section class="payment-info">
							<div class="title">Phương thức thanh toán</div>
							<dx-radio-group
								:items="paymentMethods"
								:value="codPaymentMethod"
								display-expr="text"
								layout="horizontal"
							/>
						</section>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import DxAccordion from "devextreme-vue/accordion";
import DxTextBox from "devextreme-vue/text-box";
import DxRadioGroup from "devextreme-vue/radio-group";
import CartApi from "@/apis/user/cart-api";
import { useCartStore } from "@/stores/cart";

export default {
	components: { DxTextBox, DxSelectBox, DxRadioGroup, DxAccordion },
	data() {
		return {
			paymentMethods: [{ id: 1, value: "cod", text: "COD (Trả tiền khi nhận hàng)" }],
			items: [],
			cartStore: useCartStore(),
		};
	},
	props: {
		pColor: {
			type: String,
			default: "black",
		},
	},
	computed: {
		codPaymentMethod() {
			return this.paymentMethods.find((paymentMethod) => paymentMethod.value == "cod");
		},
		totalPrice() {
			let total = 0;
			this.items.forEach((item) => {
				total += item.sellPrice * item.quantity;
			});
			return total;
		},
	},
	methods: {
		getTotalPriceItem(item) {
			// tach thanh helper function
			return item.sellPrice * item.quantity;
		},
	},
	mounted() {
		this.items = CartApi.getCart();
	},
};
</script>

<style scoped lang="scss">
#checkoutComponent {
	background-color: var(--color-main-content-background);
	min-height: 100vh;
	> * {
		height: 100%;
	}
}

.v-form-group {
	margin-top: 12px;

	.v-form-label {
		display: block;
		margin-bottom: 4px;
	}
}

// checkout info
.checkout-info {
	padding-left: 12px;
	padding-right: 12px;
	padding-bottom: 20px;
	.website-brand {
	}

	.user-info {
		margin-top: 20px;
		.logged-in-info {
			margin-bottom: 20px;
		}

		.address-wrapper {
			display: flex;
			flex-direction: column;
			gap: 12px;
			margin-bottom: 32px;
		}
	}
}

section > .title {
	margin-bottom: 16px;
	font-weight: 700;
	font-size: 18px;
}
//

// cart info
.cart-item-wrapper {
	padding: 20px 12px 12px;

	.cart-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;

		.img-parent {
			position: relative;
			width: 4.6rem;
			height: 4.6rem;
			box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
			border-radius: 8px;

			.quantity-counter {
				position: absolute;
				border-radius: 50%;
				width: 20px;
				height: 20px;
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.9rem;
				background-color: rgba(153, 153, 153, 0.9);
				font-weight: 500;
				color: #fff;

				right: -0.75em;
				top: -0.75em;
			}
		}
		.cart-detail {
			padding-left: 14px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex: 1;

			.detail-name {
				font-weight: 500;
				color: #4b4b4b;
			}
			.detail-size-color {
				display: flex;
				gap: 6px;
				font-size: 0.85714em;
				color: #969696;
			}
		}
	}
}

.price-calculation {
	padding-bottom: 20px;
	margin-left: 12px;
	margin-right: 12px;
	border-bottom: 1px solid #ccc;
	.gross-price,
	.shipping-price {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.title {
			padding-top: 0.75rem;
			color: #717171;
		}
		.price {
			padding-top: 0.75rem;
			color: #717171;
		}
	}
}

.total-price-conclusion {
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1px solid;
	padding-left: 12px;
	padding-right: 12px;
	padding-bottom: 16px;
	margin-top: 16px;

	.title {
		font-size: 1.14286em;
		color: #4b4b4b;
	}
	.price-big {
		font-size: 1.71429em;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #4b4b4b;
		line-height: 1em;
		white-space: nowrap;
	}
}

//

// Common
.container {
	padding-right: 0;
	padding-left: 0;
}
.row {
	margin-right: 0;
	margin-left: 0;
}

.row > * {
	padding-right: 0;
	padding-left: 0;
}
//

.banner {
	padding: 20px 12px;
	background: var(--color-background);
}

// Responsive
@media screen and (min-width: 768px) {
}
@media screen and (min-width: 997px) {
	.checkoutComponentContainer {
		flex-direction: row-reverse;
	}
	.checkout-info {
		background: var(--color-background);
		padding-top: 48px;
	}

	.cart-info {
		padding-top: 48px;
	}

	// Common
	.container {
		padding-right: calc(var(--bs-gutter-x) * 0.5);
		padding-left: calc(var(--bs-gutter-x) * 0.5);
	}
	.row {
		margin-right: calc(-0.5 * var(--bs-gutter-x));
		margin-left: calc(-0.5 * var(--bs-gutter-x));
	}

	.row > * {
		padding-right: calc(var(--bs-gutter-x) * 0.5);
		padding-left: calc(var(--bs-gutter-x) * 0.5);
	}
	//
}
@media screen and (min-width: 768px) {
}
//
</style>
