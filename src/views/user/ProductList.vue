<template>
	<div id="productListComponent">
		<div class="container">
			<div class="breadcrumb">
				<span>Trang chủ</span>
				/
				<span>Nam</span>
			</div>
			<div class="filter-and-sort">
				<div class="sort-wrapper">
					<div class="title">Giày nam</div>
					<DxSelectBox
						:items="sortOptions"
						value-expr="id"
						display-expr="text"
						placeholder="Sắp xếp theo"
						@valueChanged="handlePriceFilterChanged"
						:element-attr="{ class: 'v-tag-box' }"
						selectAllText="Chọn tất cả"
						noDataText="Không có dữ liệu"
					/>
				</div>
				<div class="filters-wrapper">
					<div class="left">
						<div class="filter-icon">
							<div class="icon"></div>
							<span>Bộ lọc</span>
						</div>
						<span class="btn-reset-filter" @click="resetFilter">Reset bộ lọc</span>
					</div>
					<div class="filter-wrapper">
						<span class="filter-label">Khoảng giá</span>
						<DxTagBox
							:data-source="priceRangeOptions"
							value-expr="id"
							display-expr="text"
							placeholder="Chọn khoảng giá"
							@valueChanged="handlePriceFilterChanged"
							:element-attr="{ class: 'v-tag-box' }"
							selectAllText="Chọn tất cả"
							noDataText="Không có dữ liệu"
							ref="priceRangeFilterRef"
						/>
					</div>
					<div class="filter-wrapper">
						<span class="filter-label">Hãng</span>
						<DxTagBox
							:data-source="colorDataSource"
							display-expr="name"
							value-expr="id"
							placeholder="Chọn màu"
							@valueChanged="handleColorChanged"
							:element-attr="{ class: 'v-tag-box' }"
							selectAllText="Chọn tất cả"
							noDataText="Không có dữ liệu"
							ref="brandFilterRef"
						/>
					</div>
					<div class="filter-wrapper">
						<span class="filter-label">Màu</span>
						<DxTagBox
							:data-source="colorDataSource"
							display-expr="name"
							value-expr="id"
							placeholder="Chọn màu"
							@valueChanged="handleColorChanged"
							:element-attr="{ class: 'v-tag-box' }"
							selectAllText="Chọn tất cả"
							noDataText="Không có dữ liệu"
							ref="colorFilterRef"
						/>
					</div>
					<div class="filter-wrapper">
						<span class="filter-label">Size</span>
						<DxTagBox
							display-expr="name"
							value-expr="id"
							placeholder="Chọn size"
							:data-source="sizeDataSource"
							@valueChanged="handleSizeChanged"
							:element-attr="{ class: 'v-tag-box' }"
							selectAllText="Chọn tất cả"
							noDataText="Không có dữ liệu"
							ref="sizeFilterRef"
						/>
					</div>
				</div>
			</div>
			<div class="products row row-cols-xl-5">
				<v-product v-for="product in products" :key="product.id" :item="product" class="mb-3"></v-product>
			</div>
			<div class="btn-load-more-wrapper">
				<v-button v-show="products.length > 0" @click="loadMoreProducts">Xem thêm sản phẩm</v-button>
			</div>
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import DxTagBox from "devextreme-vue/tag-box";
import BaseApi from "@/apis/base-api";
import CustomStore from "devextreme/data/custom_store";
import { PriceRangeFilterEnum } from "@/enums/price-range-filter-enum";

export default {
	components: { DxSelectBox, DxTagBox },
	data() {
		return {
			priceRangeFilterEnum: PriceRangeFilterEnum,
			priceRangeOptions: [
				{
					id: PriceRangeFilterEnum.lessThanOneMillion,
					text: "Dưới 1 triệu",
				},
				{
					id: PriceRangeFilterEnum.oneMillionToTwoMillion,
					text: "Từ 1 đến 2 triệu",
				},
				{
					id: PriceRangeFilterEnum.twoMillionToThreeMillion,
					text: "Từ 2 đến 3 triệu",
				},
				{
					id: PriceRangeFilterEnum.threeMillionToFiveMillion,
					text: "Từ 3 đến 5 triệu",
				},
				{
					id: PriceRangeFilterEnum.greaterThanFiveMillion,
					text: "Trên 5 triệu",
				},
			],
			products: [],
			productApi: new BaseApi("AdminProducts"),
			pagingRequest: {
				pageSize: 15,
				pageIndex: 0,
				isActive: true,
			},
			defaultPagingRequest: {
				// để reset filter
				pageSize: 15,
				pageIndex: 0,
				isActive: true,
			},

			//#region Filter datasource
			colorApi: new BaseApi("AdminColors"),
			colorDataSource: new CustomStore({
				key: "id",
				load: () => {
					return this.colorApi
						.getAll()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalCount: data.length };
							}
						})
						.catch((err) => console.log(err));
				},
				byKey: (key) => {
					return null;
				},
			}),

			brandApi: new BaseApi("AdminSizes"),
			sizeDataSource: new CustomStore({
				key: "id",
				load: () => {
					return this.sizeApi
						.getAll()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalCount: data.length };
							}
						})
						.catch((err) => console.log(err));
				},
				byKey: (key) => {
					return null;
				},
			}),

			brandApi: new BaseApi("AdminBrands"),
			brandDataSource: new CustomStore({
				key: "id",
				load: () => {
					return this.brandApi
						.getAll()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalCount: data.length };
							}
						})
						.catch((err) => console.log(err));
				},
				byKey: (key) => {
					return null;
				},
			}),
			//#endregion
		};
	},
	props: {
		pColor: {
			type: String,
			default: "black",
		},
	},
	computed: {},
	watch: {
		/**
		 * Mỗi khi paging request thay đổi, gọi lại hàm lấy danh sách sản phẩm theo paging request mới
		 */
		pagingRequest: {
			async handler(pagingRequest, oldPagingRequest) {
				const oldPageIndex = oldPagingRequest.pageIndex,
					pageIndex = pagingRequest.pageIndex;
				// trường hợp load thêm dữ liệu
				if (oldPageIndex != pageIndex) await this.getProducts(true);
				else await this.getProducts();
			},
			deep: true,
		},
	},
	methods: {
		/**
		 * reset filter
		 */
		resetFilter() {
			this.pagingRequest = { ...this.defaultPagingRequest };

			// reset UI các filter đang được chọn
			this.$refs.priceRangeFilterRef.instance.option("value", null);
			this.$refs.brandFilterRef.instance.option("value", null);
			this.$refs.colorFilterRef.instance.option("value", null);
			this.$refs.sizeFilterRef.instance.option("value", null);
		},
		/**
		 * load thêm sản phẩm
		 */
		loadMoreProducts() {
			this.pagingRequest.pageIndex = this.pagingRequest.pageIndex + 1;
		},
		/**
		 * load danh sách sản phẩm
		 */
		async getProducts(hasAppendMore) {
			try {
				const res = await this.productApi.getPaging(this.pagingRequest);
				if (res.data.isSuccessful) {
					const items = res.data.data[0].items;
					if (hasAppendMore == true) this.products = [...this.products, ...items];
					else this.products = items;
				} else this.$showError();
			} catch (error) {
				this.$showError();
			}
		},
		async handleColorChanged(e) {
			const colorIds = e.value;
			this.pagingRequest.colorIds = colorIds;
		},
		async handleSizeChanged(e) {
			const sizeIds = e.value;
			this.pagingRequest.sizeIds = sizeIds;
		},
		async handlePriceFilterChanged(e) {
			const priceRangeFilters = e.value;
			this.pagingRequest.priceRangeFilters = priceRangeFilters;
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

#productListComponent {
	background: var(--color-main-content-background);
	padding-top: 16px;
}

.filter-and-sort {
	margin-bottom: 16px;
}

.sort-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;

	background: #ffffff;
	padding: 15px 20px;

	margin-bottom: 16px;
	.title {
		min-width: 40vw;
		font-weight: 600;
		text-transform: uppercase;
	}
	.v-tag-box {
		flex: 1;
	}
}

.filters-wrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;

	.left {
		display: flex;
		align-items: center;
		gap: 8px;

		.filter-icon {
			display: flex;
			align-items: center;
			width: 100px;
			text-overflow: ellipsis;
			span {
				font-weight: 600;
				text-transform: uppercase;
			}
		}
	}

	.filter-wrapper {
		display: flex;
		align-items: center;
		gap: 8px;

		.filter-label {
			width: 100px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
		.v-tag-box {
			flex: 1;
		}
	}
}

.btn-reset-filter {
	text-decoration: underline;
}

.btn-load-more-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 16px;
}
</style>
