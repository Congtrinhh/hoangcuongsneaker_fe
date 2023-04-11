<template>
	<div class="" id="adminInventoryList">
		<div class="top-utility">
			<h1 class="header">Quản lý phiếu nhập</h1>
			<dx-button text="Thêm mới" @click="handleAddNewButtonClicked"></dx-button>
		</div>
		<div class="main-list">
			<dx-data-grid
				:data-source="gridDataSource"
				:show-borders="true"
				:hover-state-enabled="true"
				:remote-operations="true"
				:columns="gridColumns"
				noDataText="Không có dữ liệu"
				@row-click="handleDataRowClicked"
			>
				<template #supplierTemplate="{ data }">
					{{ data.data.supplier.name }}
				</template>

				<!-- search panel -->
				<DxSearchPanel
					:visible="true"
					:highlight-case-sensitive="true"
					:width="200"
					placeholder="Nhập mã phiếu..."
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
import AdminSupplyBillApi from "@/apis/admin/admin-supply-bill-api.js";
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
						this.pagingRequest.filterValue = filter?.filterValue;

						return AdminSupplyBillApi.getPaging(this.pagingRequest)
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
				}),
			}),
			gridColumns: [
				{ caption: "Mã phiếu nhập", dataType: "string", dataField: "supplyCode" },
				{ caption: "Nhà cung cấp", dataType: "string", cellTemplate: "supplierTemplate" },
				{ caption: "Ngày nhập", dataType: "datetime", dataField: "supplyDate" },
				{ caption: "Giá trị", dataType: "number", format: "currency", dataField: "totalPrice" },
			],
		};
	},
	props: {},
	computed: {},
	methods: {
		handleDataRowClicked(data) {
			const id = data.data.id;
			this.$router.push({
				name: this.$routeNameEnum.AdminInventoryDetail,
				params: {
					id: id,
				},
			});
		},
		handleAddNewButtonClicked() {
			const id = 0;
			this.$router.push({
				name: this.$routeNameEnum.AdminInventoryDetail,
				params: {
					id: id,
				},
			});
		},
	},
};
</script>

<style scoped lang="scss">
#adminInventoryList {
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
