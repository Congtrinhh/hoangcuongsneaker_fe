<template>
	<div id="cartDetailComponent">
		<div class="container">
			<!-- breadcrumb -->
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><router-link to="/home">Trang chủ</router-link></li>
					<li class="breadcrumb-item"><a href="#">Chi tiết giỏ hàng</a></li>
				</ol>
			</nav>

			<!-- main content -->
			<div class="row cart-main-content">
				<div class="col col-12 col-lg-8">
					<div class="cart-info-wrapper">
						<div class="title">Giỏ hàng của bạn</div>
						<span class="note">Bạn đang có {{ items?.length }} <b>sản phẩm</b> trong giỏ hàng</span>
						<!-- list items -->
						<div class="cart-item-wrapper">
							<div class="cart-item" v-for="cartItem in items" :key="cartItem.id">
								<div class="img-wrapper">
									<img :src="'data:image/jpeg;base64,' + cartItem.image" alt="" />
								</div>
								<div class="detail">
									<div class="name-and-button">
										<div class="name">{{ cartItem.name }}</div>
										<button @click="deleteItem(cartItem)" class="v-button-icon">&times;</button>
									</div>
									<div class="color-and-size">
										<span>{{ cartItem.color?.name }}</span>
										<span>{{ cartItem.size?.name }}</span>
									</div>
									<div class="quantity-and-price">
										<div class="quantity-wrapper">
											<button
												:disabled="cartItem.quantity <= 1"
												@click="decreaseQuantity(cartItem)"
												class="v-button-icon"
											>
												-
											</button>

											<span>{{ cartItem.quantity }}</span>
											<button @click="increaseQuantity(cartItem)" class="v-button-icon">+</button>
										</div>
										<div class="price">{{ getCurrencyFormat(getTotalPriceItem(cartItem)) }}</div>
									</div>
								</div>
							</div>
						</div>
						<!-- end list items -->
					</div>
				</div>
				<div class="col col-12 col-lg-4 mt-3 mt-lg-0">
					<div class="order-info-wrapper">
						<div class="title">Thông tin đơn hàng</div>

						<!-- summary -->
						<div class="order-summary">
							<div class="order-detail">
								<div class="order-text">Tổng tiền</div>
								<div class="order-price">{{ getCurrencyFormat(totalPrice) }}</div>
							</div>
						</div>
						<!-- end summary -->

						<ul class="order-more-info">
							<li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
							<li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
						</ul>

						<v-button class="w-full" v-if="items.length > 0" @click="handleCheckoutButtonClicked"
							>Thanh toán</v-button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import CartApi from "@/apis/user/cart-api";
import { useCartStore } from "@/stores/cart";
import { getCurrencyFormat } from "@/helpers/common-helpers";
import { useIndexStore } from "@/stores";

export default {
	components: {},
	data() {
		return {
			items: [],
			cartStore: useCartStore(),
			getCurrencyFormat,
		};
	},
	props: {},
	mounted() {
		this.items = CartApi.getCart();
	},
	computed: {
		totalPrice() {
			let total = 0;
			this.items.forEach((item) => {
				total += item.sellPrice * item.quantity;
			});
			return total;
		},
	},
	watch: {
		"cartStore.hasUpdate"(hasUpdate) {
			if (hasUpdate == true) {
				this.cartStore.hasUpdate = false;
				this.items = CartApi.getCart();
			}
		},
	},
	methods: {
		/**
		 * chuyển hướng đến trang đăng nhập nếu người dùng chưa đăng nhập
		 * chuyển hướng đến trang thanh toán nếu ng dùng dã đăng nhập
		 */
		handleCheckoutButtonClicked() {
			if (useIndexStore.isLoggedIn == true) {
				this.$router.push({ name: this.$routeNameEnum.Checkout });
			} else {
				this.$router.push({ name: this.$routeNameEnum.Login });
			}
		},
		deleteItem(itemToDelete) {
			// save items info after every single update
			const index = this.items.findIndex((item) => item.id == itemToDelete.id);
			this.items.splice(index, 1);

			CartApi.updateCart(this.items);
			this.cartStore.hasUpdate = true;
		},
		decreaseQuantity(item) {
			const newQuantity = item.quantity - 1;
			// api check quantity
			item.quantity = newQuantity;
			CartApi.updateCartItem(item);
			this.cartStore.hasUpdate = true;
		},
		increaseQuantity(item) {
			const newQuantity = item.quantity + 1;
			// api check quantity
			item.quantity = newQuantity;
			CartApi.updateCartItem(item);
			this.cartStore.hasUpdate = true;
		},
		getTotalPriceItem(item) {
			return item.sellPrice * item.quantity;
		},
	},
};
</script>

<style scoped lang="scss">
.cart-wrapper {
	position: relative;
	cursor: pointer;
	.cart-quantity {
		position: absolute;
		left: 75%;
		bottom: 70%;
		background: #d31c1c;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		color: #fff;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		font-weight: bold;
	}
	.cart-icon {
		width: 20px;
	}
}

.cart-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	padding-bottom: 12px;
	padding-top: 12px;
	border-bottom: 1px solid #e7e7e7;

	&:last-of-type {
		border: 0;
	}

	.img-wrapper {
		width: 80px;
		border: 1px solid #ddd;
	}
}

.detail {
	display: flex;
	flex-direction: column;
	flex: 1;
}
.name-and-button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	.name {
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		color: #252a2b;
	}
}

.color-and-size {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 16px;
}

.quantity-and-price {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.quantity-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.price {
		font-weight: 600;
		color: #000;
	}
}

.order-summary {
	display: flex;
	flex-direction: column;
	border-bottom: 1px solid;
	.order-detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 12px;
		.order-text {
			text-transform: uppercase;
			font-weight: 500;
			color: #252a2b;
			padding: 10px 0;
		}
		.order-price {
			font-weight: 600;
			font-size: 16px;
			color: red;
			padding: 10px 0;
		}
	}
}

.order-more-info {
	list-style: circle inside;
	margin: 16px 0;
}

.v-button-icon {
	cursor: pointer;
	border-radius: 4px;
	border: 1px solid #333;
	background: #fff;
	min-width: 24px;
	color: #333;
	font-weight: 500;
}

//
#cartDetailComponent {
	background: var(--color-main-content-background);
	padding: 16px 0 30px;
}
.cart-main-content {
}

.cart-info-wrapper {
	padding-bottom: 16px;

	.title {
		font-weight: 700;

		font-size: 20px;
		margin: 0;
		border-bottom: 1px solid #e7e7e7;
		padding: 10px 16px;
	}
	.note {
		font-size: 1.1rem;
		display: inline-block;
		margin: 16px 0 16px 16px;
	}
}
.cart-info-wrapper,
.order-info-wrapper {
	border-radius: 2px;
	background: var(--color-background);
	padding: 16px;
}

.order-info-wrapper {
	margin-left: 10px;

	.title {
		font-weight: 700;
		font-size: 20px;
		margin: 0;
	}
}

.cart-item-wrapper {
	padding: 16px 16px 16px 16px;
	border: 1px dashed var(--color-input-border);
	border-radius: 8px;
	margin: 0 16px;
}
//
</style>
