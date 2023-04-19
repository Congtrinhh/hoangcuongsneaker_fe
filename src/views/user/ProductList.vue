<template>
	<div id="productListComponent">
		<div class="container">
			<nav aria-label="breadcrumb">
				<ol class="breadcrumb">
					<li class="breadcrumb-item"><router-link to="/home">Trang chủ</router-link></li>
					<li class="breadcrumb-item"><a href="#">Sản phẩm</a></li>
				</ol>
			</nav>

			<div class="filter-and-sort">
				<div class="sort-wrapper">
					<div class="title">{{ title }}</div>
					<DxSelectBox
						:items="sortOptions"
						value-expr="id"
						display-expr="text"
						placeholder="Sắp xếp theo"
						@valueChanged="handleSortChanged"
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
							:data-source="brandDataSource"
							display-expr="name"
							value-expr="id"
							placeholder="Chọn hãng"
							@valueChanged="handleBrandChanged"
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
			<div v-if="isVisibleLoadMoreProductButton" class="btn-load-more-wrapper">
				<v-button @click="loadMoreProducts">Xem thêm sản phẩm</v-button>
			</div>
			<div v-else class="no-data-wrapper">
				<img src="@/assets/imgs/icons/no-data.png" alt="ảnh chú thích không có sản phẩm" />
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
import { SortOptionEnum } from "@/enums/sort-option-enum";
import { GenderEnum } from "@/enums/gender-enum";
import { useIndexStore } from "@/stores";

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
				// gender: Number(this.$route.params.gender),
			},
			defaultPagingRequest: {
				// để reset filter
				pageSize: 15,
				pageIndex: 0,
				isActive: true,
				// gender: Number(this.$route.params.gender),
			},

			sortOptions: [
				{
					id: SortOptionEnum.priceDesc,
					text: "Giá giảm dần",
				},
				{
					id: SortOptionEnum.priceAsc,
					text: "Giá tăng dần",
				},
			],

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

			sizeApi: new BaseApi("AdminSizes"),
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
			gender: 0,
			indexStore: useIndexStore,
			isLastPage: false,
		};
	},
	props: {},
	computed: {
		title() {
			if (this.gender == GenderEnum.Male) {
				return "Đồ nam";
			} else if (this.gender == GenderEnum.Female) {
				return "Đồ nữ";
			} else if (this.gender == GenderEnum.Unisex) {
				return "Đồ unisex";
			} else {
				return "Đồ nam/ nữ/ unisex";
			}
		},
		isVisibleLoadMoreProductButton() {
			if (this.product?.length == 0) return false;
			if (this.isLastPage == true) return false;
			return true;
		},
	},
	watch: {
		/**
		 * Mỗi khi paging request thay đổi, gọi lại hàm lấy danh sách sản phẩm theo paging request mới
		 */
		pagingRequest: {
			handler(currentPagingRequest, oldPagingRequest) {
				const oldPageIndex = oldPagingRequest.pageIndex,
					pageIndex = currentPagingRequest.pageIndex;
				// trường hợp load thêm dữ liệu
				if (oldPageIndex != pageIndex) this.getProducts(true);
				else this.getProducts();
			},
			deep: true,
		},
	},
	methods: {
		handleSortChanged(e) {
			const sortId = e.value;
			this.pagingRequest.sortOption = sortId;
		},
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
			let mainPageIndex = this.mainPageIndex;
			this.mainPageIndex = mainPageIndex ? mainPageIndex + 1 : 1;
			this.getProducts(true);
		},
		/**
		 * load danh sách sản phẩm
		 */
		getProducts(hasAppendMore) {
			let pagingRequest = this.pagingRequest;
			if (this.mainPageIndex)
				pagingRequest = {
					...this.pagingRequest,
					pageIndex: this.mainPageIndex,
				};
			this.productApi
				.getPaging(pagingRequest)
				.then((res) => {
					if (res.data.isSuccessful) {
						const items = res.data.data[0].items;
						const totalCount = res.data.data[0].totalRecord;
						if (items.length == totalCount) this.isLastPage = true;
						if (hasAppendMore == true) this.products = [...this.products, ...items];
						else this.products = items;
					} else this.$showError();
				})
				.catch((error) => this.$showError());
		},
		handleColorChanged(e) {
			const colorIds = e.value;
			this.pagingRequest.colorIds = colorIds;
		},
		handleSizeChanged(e) {
			const sizeIds = e.value;
			this.pagingRequest.sizeIds = sizeIds;
		},
		handlePriceFilterChanged(e) {
			const priceRangeFilters = e.value;
			this.pagingRequest.priceRangeFilters = priceRangeFilters;
		},
		handleBrandChanged(e) {
			const brandIds = e.value;
			this.pagingRequest.brandIds = brandIds;
		},
	},
	mounted() {
		this.gender = this.$route.params.gender;
		if (this.gender && Number(this.gender) > 0) {
			this.defaultPagingRequest.gender = Number(this.gender);
			this.pagingRequest.gender = Number(this.gender);
		} else {
			this.defaultPagingRequest.gender = null;
			this.pagingRequest.gender = null;
		}
	},
};
</script>

<style scoped lang="scss">
#productListComponent {
	background: var(--color-main-content-background);
	padding: 16px 0 30px;
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
	cursor: pointer;
}

.btn-load-more-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 16px;
}

.no-data-wrapper {
	height: 100%;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

// Responsive
@media screen and (min-width: 768px) {
	.filters-wrapper {
		flex-direction: row;
		flex-wrap: wrap;
		row-gap: 12px;

		.left {
			flex-basis: 100%;
		}
		.filter-wrapper {
			flex-basis: 49%;
		}
	}

	.sort-wrapper .v-tag-box {
		flex: unset;
	}

	.sort-wrapper {
		margin-bottom: 20px;
	}
}

@media screen and (min-width: 1200px) {
	.filters-wrapper {
		column-gap: 24px;
		.filter-wrapper {
			flex: 1;
			.filter-label {
				display: none;
			}
		}
	}
}
//
</style>
