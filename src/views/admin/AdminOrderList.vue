<template>
	<div class="" id="adminOrderList">
		<div class="top-utility">
			<h1 class="header">Quản lý đơn hàng</h1>

			<div class="tabs-wrapper">
				<div
					v-for="tabItem in tabs"
					:key="tabItem.id"
					:class="['tab-item', { on: tabItem.id == pagingRequest.shippingStatus }]"
					@click="handleTabClicked(tabItem)"
				>
					{{ tabItem.text }}
				</div>
			</div>
		</div>
		<div class="main-list">
			<dx-data-grid
				:data-source="gridDataSource"
				:columns="gridColumns"
				:show-borders="true"
				:remote-operations="true"
				noDataText="Không có dữ liệu"
				@row-click="handleDataRowClicked"
			>
				<template #statusTemplate="{ data }">
					{{ data.data.isActive ? "Đang active" : "Ngừng active" }}
				</template>

				<template #buttonsActionTemplate="{ data }">
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.pendingAccept"
						class="button-action"
						@click="handleBtnUpdateOrderStatusClicked($event, data, shippingStatusEnum.accepted)"
						>[Tiếp nhận]</span
					>
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.pendingAccept"
						class="button-action"
						@click="handleBtnDeactivateOrderClicked($event, data)"
						>[Huỷ đơn]</span
					>
				</template>

				<!-- search panel -->
				<DxSearchPanel
					:visible="true"
					:highlight-case-sensitive="true"
					placeholder="Nhập mã đơn hàng..."
					width="200"
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
import OrderApi from "@/apis/user/order-api";
import { DxDataGrid, DxEditing, DxPaging, DxPager, DxSearchPanel } from "devextreme-vue/data-grid";
import DxButton from "devextreme-vue/button";
import { ShippingStatusEnum } from "@/enums/shipping-status-enum";

export default {
	components: { DxDataGrid, DxButton, DxEditing, DxPaging, DxPager, DxSearchPanel },
	data() {
		return {
			shippingStatusEnum: ShippingStatusEnum,
			pagingRequest: { pageSize: 15, pageIndex: 0 },
			orderId: 0,
			gridDataSource: new DataSource({
				store: new CustomStore({
					key: "id",
					load: (loadOptions) => {
						const { skip, filter } = loadOptions;
						this.pagingRequest.pageIndex = skip / this.pagingRequest.pageSize;
						this.pagingRequest.filterValue = filter?.filterValue; // tìm kiếm giá trị filterValue có contain trong chuỗi name của sản phẩm không(xử lý ở backend)

						return OrderApi.getPaging(this.pagingRequest)
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
				{ caption: "Mã đơn hàng", dataType: "string", dataField: "code" },
				{ caption: "Trị giá (vnd)", dataType: "number", dataField: "billPrice" },
				{ caption: "Trạng thái", dataField: "isActive", cellTemplate: "statusTemplate" },
				{ caption: "Ngày tạo", dataType: "date", dataField: "createdAt" },
				{ caption: "", fixed: true, fixedPosition: "right", cellTemplate: "buttonsActionTemplate" },
			],

			// danh sach tab
			tabs: [
				{
					id: ShippingStatusEnum.pendingAccept,
					text: "Chờ tiếp nhận",
				},
				{
					id: ShippingStatusEnum.accepted,
					text: "Đã tiếp nhận",
				},
				{
					id: ShippingStatusEnum.delivering,
					text: "Đang giao",
				},
				{
					id: ShippingStatusEnum.delivered,
					text: "Đã giao",
				},
				{
					id: ShippingStatusEnum.deliverFailed,
					text: "Giao không thành công",
				},
			],
		};
	},
	props: {},
	computed: {},
	mounted() {
		this.pagingRequest.shippingStatus = ShippingStatusEnum.pendingAccept;
	},
	methods: {
		handleDataRowClicked(data) {
			const id = data.data.id;
			this.$router.push({
				name: this.$routeNameEnum.AdminOrderDetail,
				params: {
					id: id,
				},
			});
		},
		handleTabClicked(tabItem) {
			this.pagingRequest.shippingStatus = tabItem.id;
			this.gridDataSource.reload();
		},
		handleBtnUpdateOrderStatusClicked($event, data, updateStatus) {
			$event.stopPropagation();

			const order = data.data;
			order.shippingStatus = updateStatus;
			OrderApi.update(order.id, order)
				.then((res) => {
					this.gridDataSource.reload();
				})
				.catch((err) => this.$showError());
		},
		handleBtnDeactivateOrderClicked($event, data) {
			$event.stopPropagation();

			const order = data.data;
			order.isActive = false;
			OrderApi.update(order.id, order)
				.then((res) => {
					this.gridDataSource.reload();
				})
				.catch((err) => this.$showError());
		},
	},
};
</script>

<style scoped lang="scss">
#adminOrderList {
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

.tabs-wrapper {
	margin-top: 24px;
	margin-bottom: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	.tab-item {
		padding: 6px 12px;
		background: #fff;
		border-radius: 4px;
		border-right: 1px solid #eee;
		cursor: pointer;
		font-size: 1.1rem;
		font-weight: 500;

		&.on {
			background: #ddd;
		}

		&:last-of-type {
			border-right: none;
		}
	}
}

.button-action {
	cursor: pointer;
	margin: 0 12px;
}
</style>
