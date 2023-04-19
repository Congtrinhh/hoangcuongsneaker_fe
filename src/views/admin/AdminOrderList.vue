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
			<!-- select filter order date -->
			<dx-select-box
				:items="dateFilterOptions"
				v-model="dateFilterId"
				display-expr="text"
				value-expr="id"
				width="200"
			></dx-select-box>

			<!-- datagrid -->
			<dx-data-grid
				:data-source="gridDataSource"
				:columns="gridColumns"
				:show-borders="true"
				:remote-operations="true"
				:hover-state-enabled="true"
				noDataText="Không có dữ liệu"
				ref="gridRef"
				@row-click="handleDataRowClicked"
			>
				<template #statusTemplate="{ data }">
					{{ data.data.isActive ? "Đang active" : "Ngừng active" }}
				</template>

				<template #buttonsActionTemplate="{ data }">
					<!-- nút tiếp nhận đơn hàng -->
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.pendingAccept"
						class="button-action"
						@click="handleBtnUpdateOrderStatusClicked($event, data, shippingStatusEnum.accepted)"
						>[Tiếp nhận]</span
					>
					<!-- nút huỷ active đơn hàng -->
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.pendingAccept"
						class="button-action"
						@click="handleBtnDeactivateOrderClicked($event, data)"
						>[Huỷ đơn]</span
					>
					<!-- nút huỷ tiếp nhận -->
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.accepted"
						class="button-action"
						@click="handleBtnUpdateOrderStatusClicked($event, data, shippingStatusEnum.pendingAccept)"
						>[Huỷ tiếp nhận]</span
					>

					<!-- nút chuyển thành đang giao -->
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.accepted"
						class="button-action"
						@click="handleBtnUpdateOrderStatusClicked($event, data, shippingStatusEnum.delivering)"
						>[Đang giao]</span
					>

					<!-- nút chuyển thành đã giao -->
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.delivering"
						class="button-action"
						@click="handleBtnUpdateOrderStatusClicked($event, data, shippingStatusEnum.delivered)"
						>[Đã giao]</span
					>

					<!-- nút chuyển thành  giao thất bại -->
					<span
						v-if="data.data.shippingStatus == shippingStatusEnum.delivering"
						class="button-action"
						@click="handleBtnUpdateOrderStatusClicked($event, data, shippingStatusEnum.deliverFailed)"
						>[Giao không thành công]</span
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
import DxSelectBox from "devextreme-vue/select-box";
import { DateFilterOptionEnum } from "@/enums/date-filter-option-enum";

export default {
	components: { DxDataGrid, DxButton, DxEditing, DxPaging, DxPager, DxSearchPanel, DxSelectBox },
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

						this.setupGridColumns();

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
								let errorMessage = "Có lỗi xảy ra";
								if (err.response.status == 401)
									errorMessage = "Bạn không có quyền thực hiện chức năng này";
								else if (err.response.status == 403)
									errorMessage = "Bạn không có quyền thực hiện chức năng này";
								this.$showError(errorMessage);
							});
					},
				}),
			}),
			gridColumns: [
				{ caption: "Mã đơn hàng", dataType: "string", dataField: "code" },
				{
					caption: "Trị giá (vnd)",
					dataType: "number",
					dataField: "billPrice",
					format: { style: "currency", currency: "vnd" },
				},
				{ caption: "Trạng thái", dataField: "isActive", cellTemplate: "statusTemplate" },
				{ caption: "Ngày tạo", dataType: "date", dataField: "createdAt", format: "dd/MM/yyyy HH:mm" },
				{
					caption: "Ngày giao xong",
					dataType: "date",
					dataField: "shippedAt",
					format: "dd/MM/yyyy HH:mm",
					visible: false,
				},
				{
					caption: "",
					fixed: true,
					fixedPosition: "right",
					cellTemplate: "buttonsActionTemplate",
					dataField: "buttonsAction",
				},
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

			// danh sách option lọc đơn hàng theo ngày mà đơn được tạo
			dateFilterOptions: [
				{ id: DateFilterOptionEnum.today, text: "Hôm nay" },
				{ id: DateFilterOptionEnum.thisWeek, text: "Tuần này" },
				{ id: DateFilterOptionEnum.thisMonth, text: "Tháng này" },
				{ id: DateFilterOptionEnum.all, text: "Tất cả" },
			],
			dateFilterId: 0,
		};
	},
	props: {},
	computed: {},
	watch: {
		dateFilterId(value) {
			this.pagingRequest.dateFilter = value;
			this.gridDataSource.reload();
		},
	},
	mounted() {
		this.pagingRequest.shippingStatus = ShippingStatusEnum.pendingAccept;

		this.dateFilterId = this.dateFilterOptions[0].id;
	},
	methods: {
		/**
		 * ẩn/ hiện một vài cột của grid tuỳ vào tab đang hiển thị
		 */
		setupGridColumns() {
			if (
				this.pagingRequest.shippingStatus == ShippingStatusEnum.delivered ||
				this.pagingRequest.shippingStatus == ShippingStatusEnum.deliverFailed
			) {
				this.$refs.gridRef.instance.columnOption("shippedAt", "visible", true);
				this.$refs.gridRef.instance.columnOption("buttonsAction", "visible", false);
			} else {
				this.$refs.gridRef.instance.columnOption("shippedAt", "visible", false);
				this.$refs.gridRef.instance.columnOption("buttonsAction", "visible", true);
			}
		},
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
			order.isActive = true;

			if (
				order.shippingStatus == ShippingStatusEnum.delivered ||
				order.shippingStatus == ShippingStatusEnum.deliverFailed
			) {
				order.shippedAt = new Date();
			}

			OrderApi.update(order.id, order)
				.then((res) => {
					this.gridDataSource.reload();
				})
				.catch((err) => {
					let errorMessage = "Có lỗi xảy ra";
					if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
					else if (err.response.status == 403) errorMessage = "Bạn không có quyền thực hiện chức năng này";
					this.$showError(errorMessage);
				});
		},
		handleBtnDeactivateOrderClicked($event, data) {
			$event.stopPropagation();

			const order = data.data;
			order.isActive = false;
			OrderApi.update(order.id, order)
				.then((res) => {
					this.gridDataSource.reload();
					this.$showSuccess("Huỷ đơn hàng thành công");
				})
				.catch((err) => {
					let errorMessage = "Có lỗi xảy ra";
					if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
					else if (err.response.status == 403) errorMessage = "Bạn không có quyền thực hiện chức năng này";
					this.$showError(errorMessage);
				});
		},
		/**
		 *
		 * @param {} e
		 */
		handleDateFilterChanged(e) {
			const dateFilter = e.value;
			this.pagingRequest.dateFilter = dateFilter;
			this.gridDataSource.reload();
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
	border-radius: 4px;
	padding: 6px;

	&:hover {
		color: #fff;
		background: #333;
	}
}
</style>
