<template>
	<div class="cart-wrapper" id="cartComponent" @click="handleToggle">
		<div class="cart-quantity">{{ items?.length }}</div>
		<img class="cart-icon" src="@/assets/imgs/icons/shopping-cart.png" />
		<dx-popover
			:width="420"
			:visible="cartStore.hasOpenCart"
			:target="target"
			:position="position"
			:show-title="true"
			@hiding="handlePopoverHiding"
		>
			<template #title>
				<div class="popover-header">{{ title }}</div>
			</template>
			<template #content>
				<div class="cart-item" v-for="cartItem in items" :key="cartItem.id">
					<div class="img-wrapper"><img :src="'data:image/jpeg;base64,' + cartItem.image" alt="" /></div>
					<div class="detail">
						<div class="name-and-button">
							<div class="name">{{ cartItem.name }}</div>
							<button @click="deleteItem" class="v-button-icon">&times;</button>
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
							<div class="price">{{ getTotalPriceItem(cartItem) }}</div>
						</div>
					</div>
				</div>

				<!-- summary -->
				<div class="cart-summary">
					<div class="summary-detail">
						<div class="summary-text">Tổng tiền</div>
						<div class="summary-price">{{ totalPrice }}</div>
					</div>
					<router-link class="btn-view-cart-detail" to="/cart-detail" @click="hideCartComponent">
						<v-button class="w-full">XEM GIỎ HÀNG</v-button>
					</router-link>
				</div>
			</template>
		</dx-popover>
	</div>
</template>

<script>
import { DxPopover } from "devextreme-vue/popover";
import CartApi from "@/apis/user/cart-api";
import { useCartStore } from "@/stores/cart";

export default {
	components: { DxPopover },
	data() {
		return {
			items: [],
			// isVisible: false,
			cartStore: useCartStore(),
		};
	},
	props: {
		target: {
			type: String,
			default: ".cart-wrapper",
		},
		position: {
			type: [String, Object],
			default: {
				my: "right top",
				at: "bottom",
				offset: "10 0",
			},
		},
		title: {
			type: String,
			default: "giỏ hàng",
		},
	},
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
		"cartStore.hasUpdate"(hasUpdate, oldHasUpdate) {
			if (hasUpdate == true) {
				this.cartStore.hasUpdate = false;
				this.items = CartApi.getCart();
			}
		},
		"cartStore.hasOpenCart"(hasOpenCart, oldHasOpenCart) {
			if (hasOpenCart == true) {
			}
		},
	},
	methods: {
		handlePopoverHiding() {
			this.cartStore.hasOpenCart = false;
		},
		handleToggle() {
			this.cartStore.hasOpenCart = !this.cartStore.hasOpenCart;
		},
		deleteItem(itemToDelete) {
			// save items info after every single update
			const index = this.items.findIndex((item) => item.id == itemToDelete.id);
			this.items.splice(index, 1);

			CartApi.updateCart(this.items);
		},
		decreaseQuantity(item) {
			const newQuantity = item.quantity - 1;
			// api check quantity
			item.quantity = newQuantity;
			CartApi.updateCartItem(item);
		},
		increaseQuantity(item) {
			const newQuantity = item.quantity + 1;
			// api check quantity
			item.quantity = newQuantity;
			CartApi.updateCartItem(item);
		},
		getTotalPriceItem(item) {
			return item.sellPrice * item.quantity;
		},
		hideCartComponent() {
			this.cartStore.hasOpenCart = false;
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
		left: 70%;
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

.popover-header {
	text-transform: uppercase;
	text-align: center;
}

.cart-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	padding-bottom: 12px;
	padding-top: 12px;
	border-bottom: 1px solid #e7e7e7;

	.img-wrapper {
		width: 80px;
		img {
		}
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

.cart-summary {
	display: flex;
	flex-direction: column;
	padding: 10px 0;
	.summary-detail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.summary-text {
			text-transform: uppercase;
			font-weight: 500;
			color: #252a2b;
			padding: 10px 0;
		}
		.summary-price {
			font-weight: 600;
			font-size: 16px;
			color: red;
			padding: 10px 0;
		}
	}
}

.v-button-icon {
	cursor: pointer;
}

.btn-view-cart-detail {
	// display: block;
}
</style>
