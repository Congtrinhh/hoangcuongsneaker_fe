<template>
	<div class="" id="checkoutComponent">
		<div class="container">
			<div class="row checkoutComponentContainer">
				<div class="col-12 banner d-block d-lg-none"><h1>HoangCuongSneaker</h1></div>
				<div class="col-12 col-lg-5">
					<div class="cart-info">
						<section class="cart-item-wrapper">
							<div class="cart-item" v-for="cartItem in orderItems" :key="cartItem.id">
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
									<div class="cart-price">{{ getCurrencyFormat(getTotalPriceItem(cartItem)) }}</div>
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
							<div class="price price-big">{{ getCurrencyFormat(totalPrice) }}</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-7">
					<div class="checkout-info">
						<h1 class="website-brand d-none d-lg-block mb-2">HoangCuongSneaker</h1>

						<nav aria-label="breadcrumb">
							<ol class="breadcrumb">
								<li class="breadcrumb-item">
									<router-link to="/cart-detail"><span>Giỏ hàng</span></router-link>
								</li>
								<li class="breadcrumb-item"><a href="#">Thông tin đơn hàng</a></li>
							</ol>
						</nav>

						<section class="user-info">
							<div class="title">Thông tin đơn hàng</div>

							<div class="logged-in-info">
								{{ userInfo.userName }} <span v-show="userInfo.email">({{ userInfo.email }})</span>
								<br /><span class="logout-text" @click="handleLogout"> Đăng xuất</span>
							</div>

							<!-- name -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Họ tên</label>
								<dx-text-box placeholder="Họ tên" v-model="userInfo.userName" />
							</div>

							<!-- email -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Email</label>
								<dx-text-box placeholder="Email" v-model="userInfo.email" />
							</div>

							<!-- phone -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Số điện thoại</label>
								<!-- <DxTextBox :mask-rules="{ X: /[02-9]/ }" mask="+1 (X00) 000-0000" /> -->
								<DxTextBox placeholder="Số điện thoại" mode="tel" v-model="userInfo.phone" />
							</div>

							<!-- 3 select box: province - city - ward -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Tỉnh/thành phố - quận huyện - xã phường</label>
								<div class="address-wrapper">
									<DxSelectBox
										:data-source="provinceDataSource"
										display-expr="name"
										placeholder="Tỉnh"
										@valueChanged="handleProvinceChanged"
										v-model="userInfo.province"
									/>
									<DxSelectBox
										:data-source="districtDataSource"
										display-expr="name"
										placeholder="Thành phố"
										@valueChanged="handleDistrictChanged"
										v-model="userInfo.district"
									/>
									<DxSelectBox
										:data-source="wardDataSource"
										display-expr="name"
										placeholder="Quận/huyện/xã"
										v-model="userInfo.ward"
									/>
								</div>
							</div>

							<!-- specific address -->
							<div class="v-form-group">
								<label for="" class="v-form-label">Địa chỉ cụ thể</label>
								<dx-text-box placeholder="Số nhà, tổ dân phố" v-model="userInfo.specificAddress" />
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

						<section class="my-3">
							<v-button @click="handleSave">Hoàn tất đơn hàng</v-button>
						</section>

						<div v-show="errorMessage" class="error my-3">{{ errorMessage }}</div>
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
import OrderApi from "@/apis/user/order-api";
import { useCartStore } from "@/stores/cart";
import CustomStore from "devextreme/data/custom_store";
import { getCurrencyFormat } from "@/helpers/common-helpers";
import { useIndexStore } from "@/stores";
import AuthenticationApi from "@/apis/authentication-api";

export default {
	components: { DxTextBox, DxSelectBox, DxRadioGroup, DxAccordion },
	data() {
		return {
			paymentMethods: [{ id: 1, value: "cod", text: "COD (Thanh toán khi nhận hàng)" }],
			orderItems: [],
			cartStore: useCartStore(),
			provinceDataSource: new CustomStore({
				key: "id",
				load: (loadOptions) => {
					return OrderApi.getProvinces()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalRecord: data.length };
							}
						})
						.catch((err) => console.log(err));
				},
				byKey: () => {},
			}),
			districtDataSource: [],
			wardDataSource: [],

			//#region Model chính: thông tin thanh toán
			userInfo: {},
			//#endregion
			getCurrencyFormat,
			errorMessage: "",
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
			this.orderItems.forEach((item) => {
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
		handleProvinceChanged(e) {
			const provinceId = e.value?.id;
			this.districtDataSource = [];
			this.wardDataSource = [];
			OrderApi.getDistricts(provinceId)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.districtDataSource = res.data.data;
					}
				})
				.catch((err) => console.log(err));
		},
		handleDistrictChanged(e) {
			const districtId = e.value?.id;
			OrderApi.getWards(districtId)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.wardDataSource = res.data.data;
					}
				})
				.catch((err) => console.log(err));
		},
		handleSave() {
			this.errorMessage = "";
			// generate address
			this.userInfo.address = this.getAddressText();

			const payload = this.getPayload();
			console.log(payload);
			OrderApi.create(payload)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.$router.push({
							name: this.$routeNameEnum.Home,
						});

						//update cart store
						CartApi.clearCart();

						this.$showSuccess("Thanh toán thành công");
					} else {
						this.errorMessage = res.data.errorMessage;
					}
				})
				.catch((err) => this.$showError());
		},
		getAddressText() {
			const province = this.userInfo.province?.name;
			const district = this.userInfo.district?.name;
			const ward = this.userInfo.ward?.name;
			return `${this.userInfo.specificAddress}, ${ward}, ${district}, ${province}`;
		},
		getPayload() {
			let payload = {};
			payload.user = this.userInfo;
			let orderItems = this.orderItems.map((item) => {
				item.price = item.sellPrice;
				return item;
			});
			payload.orderItems = orderItems;
			return payload;
		},
		/**
		 * xu ly dang xuat nguoi dung khoi he thong
		 */
		handleLogout() {
			try {
				AuthenticationApi.doLogout();
				this.$router.push({ name: this.$routeNameEnum.Home });
				this.$showSuccess("Đăng xuất thành công");
			} catch (error) {
				this.$showError();
			}
		},
	},
	mounted() {
		this.orderItems = CartApi.getCart();
		this.userInfo = useIndexStore.userInfo;
	},
};
</script>

<style scoped lang="scss">
#checkoutComponent {
	background-color: var(--color-main-content-background);
	padding: 16px 0 30px;

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

.logout-text {
	text-decoration: underline;
	display: inline-block;
	margin-top: 6px;
	cursor: pointer;
}

// Responsive
@media screen and (min-width: 768px) {
}
@media screen and (min-width: 992px) {
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
