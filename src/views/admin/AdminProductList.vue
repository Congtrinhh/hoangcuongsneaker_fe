<template>
	<div class="" id="adminProductList">
		<div class="top-utility">
			<h1 class="header">Quản lý sản phẩm</h1>
			<dx-button text="Thêm mới" @click="handleAddNewButtonClicked"></dx-button>
		</div>
		<div class="main-list">
			<dx-data-grid
				:data-source="gridDataSource"
				:columns="gridColumns"
				:show-borders="true"
				:hover-state-enabled="true"
				:remote-operations="true"
				noDataText="Không có dữ liệu"
				@row-click="handleDataRowClicked"
			>
				<template #productImage="{ data }">
					<img :src="'data:image/jpeg;base64,' + data.data.images[0]?.content" :width="100" />
				</template>

				<template #statusTemplate="{ data }">
					{{ data.data.isActive ? "Đang active" : "Ngừng active" }}
				</template>

				<!-- button delete -->
				<dx-editing :allow-deleting="true" mode="row" />

				<!-- search panel -->
				<DxSearchPanel
					:visible="true"
					:highlight-case-sensitive="true"
					:width="200"
					placeholder="Nhập tên sản phẩm..."
				/>
				<!-- paging -->
				<DxPager :allowed-page-sizes="[15, 25, 50]" :show-page-size-selector="true" />
				<DxPaging :page-size="pagingRequest.pageSize" />
			</dx-data-grid>
		</div>
	</div>
</template>

<script>
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import AdminProductApi from "@/apis/admin/admin-product-api.js";
import { DxDataGrid, DxEditing, DxPaging, DxPager, DxSearchPanel } from "devextreme-vue/data-grid";
import DxButton from "devextreme-vue/button";

export default {
	components: { DxDataGrid, DxButton, DxEditing, DxPaging, DxPager, DxSearchPanel },
	data() {
		return {
			pagingRequest: { pageSize: 15, pageIndex: 0 },
			gridDataSource: new DataSource({
				store: new CustomStore({
					key: "id",
					load: (loadOptions) => {
						const { skip, filter } = loadOptions;
						this.pagingRequest.pageIndex = skip / this.pagingRequest.pageSize;
						this.pagingRequest.filterValue = filter?.filterValue; // tìm kiếm giá trị filterValue có contain trong chuỗi name của sản phẩm không(xử lý ở backend)

						return AdminProductApi.getPaging(this.pagingRequest)
							.then((res) => {
								if (res.data.isSuccessful) {
									const data = res.data.data[0].items;
									const totalCount = res.data.data[0].totalRecord;
									return {
										data,
										totalCount,
									};
								} else {
									this.$showError("Có lỗi xảy ra");
									return {
										data: [],
										totalItem: 0,
									};
								}
							})
							.catch((err) => {
								this.$showError("Có lỗi xảy ra");
							});
					},
					remove: (key) => {
						return AdminProductApi.delete(key)
							.then((res) => {
								if (res.data.isSuccessful) {
									this.$showSuccess("Xoá thành công");
								} else {
									this.$showError("Xoá thất bại");
								}
							})
							.catch((err) => {
								this.$showError("Xoá thất bại");
							});
					},
				}),
			}),
			gridColumns: [
				{ caption: "", cellTemplate: "productImage" },
				{ caption: "Tên sản phẩm", dataType: "string", dataField: "name", minWidth: 300 },
				{
					caption: "Giá",
					dataField: "price",
					dataType: "number",
					format: { style: "currency", currency: "vnd" },
				},
				{ caption: "Trạng thái", dataField: "isActive", cellTemplate: "statusTemplate" },
			],
		};
	},
	props: {},
	computed: {},
	methods: {
		handleDataRowClicked(data) {
			const id = data.data.id;
			this.$router.push({
				name: this.$routeNameEnum.AdminProductDetail,
				params: {
					id: id,
				},
			});
		},
		handleAddNewButtonClicked() {
			const id = 0;
			this.$router.push({
				name: this.$routeNameEnum.AdminProductDetail,
				params: {
					id: id,
				},
			});
		},
	},
};
</script>

<style scoped lang="scss">
#adminProductList {
}

.action-buttons {
	display: flex;
	gap: 16px;
}
.action-button {
	width: 40px;
	height: 40px;
	background: #333;
	cursor: pointer;
}
</style>
