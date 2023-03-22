<template>
	<div id="productListComponent" class="container">
		<div class="breadcrumb">
			<span>Trang chủ</span>
			/
			<span>Nam</span>
		</div>
		<div class="filter-and-sort">
			<div class="sort-wrapper">
				<div class="title">Giày nam</div>
				<DxSelectBox
					:data-source="filterOptions"
					value-expr="id"
					display-expr="text"
					placeholder="Lọc theo..."
				/>
			</div>
			<div class="filter-wrapper">
				<div class="left">
					<div class="icon"></div>
					<span>Bộ lọc</span>
				</div>
				<DxTagBox :data-source="colorOptions" display-expr="name" value-expr="id" placeholder="Chọn màu" />
				<DxTagBox :data-source="sizeOptions" display-expr="name" value-expr="id" placeholder="Chọn size" />
			</div>
		</div>
		<div class="products row row-cols-xl-5">
			<v-product v-for="product in products" :key="product.id" :item="product"></v-product>
		</div>
		<v-button>Xem thêm sản phẩm</v-button>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import DxTagBox from "devextreme-vue/tag-box";
import BaseApi from "@/apis/base-api";
export default {
	components: { DxSelectBox, DxTagBox },
	data() {
		return {
			color: "green",
			filterOptions: [
				{
					id: 1,
					text: "Giá tăng dần",
				},
				{
					id: 2,
					text: "Giá tăng trần dần",
				},
			],
			sizeOptions: [
				{
					id: 1,
					name: "41",
				},
				{
					id: 2,
					name: "42",
				},
			],
			colorOptions: [
				{
					id: 1,
					name: "đỏ",
				},
				{
					id: 2,
					name: "trắng",
				},
			],
			products: [],
			productApi: new BaseApi("AdminProducts"),
		};
	},
	props: {
		pColor: {
			type: String,
			default: "black",
		},
	},
	computed: {},
	methods: {
		async getProducts(pagingRequest) {
			try {
				const res = await this.productApi.getAll();
				if (res.data.isSuccessful) {
					this.products = res.data.data;
					console.log(this.products[0]);
					// notify success
				} else {
				}
			} catch (error) {
				// notify error
			}
		},
	},
	async mounted() {
		await this.getProducts();
	},
};
</script>

<style scoped lang="scss">
.breadcrumb {
	margin: 10px 0;
	font-size: 0.9px;
}
</style>
