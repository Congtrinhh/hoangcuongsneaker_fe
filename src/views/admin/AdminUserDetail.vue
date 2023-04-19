<template>
	<div id="adminOrderDetail" class="">
		<h1 class="mb-3">{{ title }}</h1>

		<div class="main-content">
			<div class="v-form-group">
				<label for="" class="v-form-label">Tên đăng nhập</label>
				<DxTextBox v-model="model.userName" :read-only="true" width="30vw" />
			</div>

			<div class="v-form-group">
				<label for="" class="v-form-label"> Email </label>
				<DxTextBox v-model="model.email" :read-only="true" width="30vw" />
			</div>

			<div class="v-form-group">
				<label for="" class="v-form-label">Số điện thoại </label>
				<DxTextBox v-model="model.phone" :read-only="true" width="30vw" />
			</div>

			<!-- trạng thái -->
			<div class="v-form-group">
				<DxCheckBox text="Trạng thái" v-model="model.isActive" />
			</div>

			<!-- danh sách sp con của sp chính -->
			<div class="v-form-group main-list">
				<label for="" class="v-form-label">Danh sách đơn hàng đã đặt</label>
				<dx-data-grid
					:data-source="this.model.orders"
					:show-borders="true"
					:height="'40vh'"
					:columns="gridColumns"
					noDataText="Không có dữ liệu"
					:hover-state-enabled="true"
					@row-click="handleDataRowClicked"
				>
					<template #shippingStatusTemplate="{ data }">
						{{ $getShippingStatusText(data.data.shippingStatus) }}
					</template>

					<template #statusTemplate="{ data }">
						{{ data.data.isActive ? "Đang active" : "Ngừng active" }}
					</template>

					<!-- scrolling -->
					<DxScrolling mode="standard" />

					<!-- search panel -->
					<DxSearchPanel
						:visible="true"
						:highlight-case-sensitive="true"
						placeholder="Nhập mã đơn hàng..."
						width="200"
					/>
				</dx-data-grid>
			</div>
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import DxTextBox from "devextreme-vue/text-box";
import AdminUserApi from "@/apis/admin/admin-user-api";
import DxButton from "devextreme-vue/button";
import DxValidator, { DxRequiredRule, DxPatternRule } from "devextreme-vue/validator";
import DxValidationGroup from "devextreme-vue/validation-group";
import { DxCheckBox } from "devextreme-vue/check-box";

import {
	DxDataGrid,
	DxColumn,
	DxScrolling,
	DxEditing,
	DxPopup,
	DxLookup,
	DxForm,
	DxPaging,
	DxPager,
	DxSearchPanel,
} from "devextreme-vue/data-grid";
import { DxTextArea } from "devextreme-vue/text-area";
import { DxItem } from "devextreme-vue/form";
import { ModelState } from "@/enums/model-state";

export default {
	components: {
		DxSelectBox,
		DxTextBox,
		DxValidator,
		DxRequiredRule,
		DxPatternRule,
		DxValidationGroup,
		DxButton,
		DxDataGrid,
		DxScrolling,
		DxColumn,
		DxPaging,
		DxEditing,
		DxPopup,
		DxLookup,
		DxForm,
		DxItem,
		DxTextArea,
		DxPager,
		DxCheckBox,
		DxSearchPanel,
	},
	data() {
		return {
			model: {}, // đối tượng người dùng
			modelState: ModelState,
			editMode: ModelState.insert,
			userId: 0,

			//#region Danh sách đơn hàng
			gridColumns: [
				{ caption: "Mã đơn hàng", dataType: "string", dataField: "code" },
				{
					caption: "Trị giá",
					dataType: "number",
					dataField: "billPrice",
					format: { style: "currency", currency: "vnd" },
				},
				{ caption: "Ngày tạo", dataType: "date", dataField: "createdAt", format: "dd/MM/yyyy HH:mm" },
				{ caption: "Trạng thái đơn hàng", dataField: "shippingStatus", cellTemplate: "shippingStatusTemplate" },
				{ caption: "Trạng thái", dataField: "isActive", cellTemplate: "statusTemplate" },
			],
			//#endregion

			//#endregion
		};
	},
	props: {},
	computed: {
		title() {
			return "Chi tiết người dùng";
		},
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
	},
	watch: {},
	mounted() {
		this.userId = Number(this.$route.params.id);
		if (this.userId > 0) {
			AdminUserApi.getById(this.userId)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.model = res.data.data[0];
					} else {
						this.$showError();
					}
				})
				.catch((err) => {
					let errorMessage = "Có lỗi xảy ra";
					if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
					else if (err.response.status == 403) errorMessage = "Bạn không có quyền thực hiện chức năng này";
					this.$showError(errorMessage);
				});
		}
	},
};
</script>

<style scoped lang="scss">
#adminOrderDetail {
}

.image-gallery-wrapper {
	display: flex;
	flex-direction: column;
	.list-image {
		display: flex;
		align-items: flex-start;
		gap: 20px;
	}
	.img-parent {
		position: relative;
		border: 1px solid #ccc;
		.delete-icon {
			position: absolute;
			right: -6px;
			top: -6px;
			background: red;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			text-align: center;
			color: #fff;
			font-weight: 600;
			cursor: pointer;
		}
		.set-avatar {
			display: none;
		}
	}

	.btn-add-image {
		margin-top: 16px;
		align-self: flex-start;
	}
}
</style>
