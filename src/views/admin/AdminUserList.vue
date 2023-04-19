<template>
	<div class="" id="adminOrderList">
		<div class="top-utility">
			<h1 class="header">Quản lý người dùng</h1>
		</div>
		<div class="main-list">
			<dx-data-grid
				:data-source="gridDataSource"
				:columns="gridColumns"
				:show-borders="true"
				:remote-operations="true"
				:hover-state-enabled="true"
				noDataText="Không có dữ liệu"
				@row-click="handleDataRowClicked"
			>
				<template #statusTemplate="{ data }">
					{{ data.data.isActive ? "Đang active" : "Ngừng active" }}
				</template>

				<template #orderQuantityTemplate="{ data }">
					{{ data.data.orders?.length }}
				</template>

				<template #buttonsActionTemplate="{ data }">
					<span class="button-action" @click="handleBtnChangeStatusClick($event, data)">
						{{ data.data.isActive ? "[Tắt tài khoản]" : "[Bật tài khoản]" }}
					</span>
				</template>

				<!-- search panel -->
				<DxSearchPanel
					:visible="true"
					:highlight-case-sensitive="true"
					placeholder="Nhập tên đăng nhập/email/số điện thoại..."
					width="300"
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
import AdminUserApi from "@/apis/admin/admin-user-api";
import { DxDataGrid, DxEditing, DxPaging, DxPager, DxSearchPanel } from "devextreme-vue/data-grid";
import DxButton from "devextreme-vue/button";
import { ShippingStatusEnum } from "@/enums/shipping-status-enum";

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

						return AdminUserApi.getPaging(this.pagingRequest)
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
				{ caption: "Tên tài khoản", dataType: "string", dataField: "userName" },
				{ caption: "Email", dataType: "string", dataField: "email" },
				{ caption: "Điện thoại", dataType: "string", dataField: "phone" },
				{ caption: "Số đơn hàng đã đặt", cellTemplate: "orderQuantityTemplate" },
				{ caption: "Trạng thái", dataField: "isActive", cellTemplate: "statusTemplate" },
				{ caption: "Ngày tạo tài khoản", dataType: "date", dataField: "createdAt", format: "dd/MM/yyyy HH:mm" },
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
	mounted() {},
	methods: {
		handleDataRowClicked(data) {
			const id = data.data.id;
			this.$router.push({
				name: this.$routeNameEnum.AdminUserDetail,
				params: {
					id: id,
				},
			});
		},
		// handleTabClicked(tabItem) {
		// 	this.pagingRequest.shippingStatus = tabItem.id;
		// 	this.gridDataSource.reload();
		// },
		handleBtnChangeStatusClick($event, data) {
			$event.stopPropagation();

			const user = data.data;
			user.isActive = !user.isActive;
			AdminUserApi.update(user.id, user)
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
