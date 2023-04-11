<template>
	<div id="adminOrderDetail" class="">
		<h1 class="mb-3">{{ title }}</h1>

		<div class="main-content">
			<!-- Mã đơn hàng -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Mã đơn hàng</label>
				<DxTextBox v-model="model.code" :read-only="true" />
			</div>

			<!-- trị giá -->
			<div class="v-form-group">
				<label for="" class="v-form-label"> Trị giá </label>
				<DxTextBox v-model="model.billPrice" mode="number" :read-only="true" />
			</div>

			<!-- trạng thái -->
			<div class="v-form-group">
				<DxCheckBox text="Trạng thái" v-model="model.isActive" />
			</div>

			<!-- danh sách sp con của sp chính -->
			<div class="v-form-group main-list">
				<label for="" class="v-form-label">Danh sách sản phẩm</label>
				<dx-data-grid
					:data-source="this.model.orderItems"
					:columns="gridColumns"
					:show-borders="true"
					:hover-state-enabled="true"
					:height="'40vh'"
					noDataText="Không có dữ liệu"
					@row-click="handleDataRowClicked"
				>
					<template #quantityTemplate="{ data }">
						{{ data.data.quantity }}
					</template>
					<!-- paging -->

					<!-- scrolling -->
					<DxScrolling mode="standard" />
				</dx-data-grid>
			</div>
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import BaseApi from "@/apis/base-api";
import DxTextBox from "devextreme-vue/text-box";
import CustomStore from "devextreme/data/custom_store";
import OrderApi from "@/apis/user/order-api";
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
	},
	data() {
		return {
			model: {}, // đối tượng sản phẩm
			modelState: ModelState,
			editMode: ModelState.insert,

			//#region Order item
			initialDataSource: [], // dùng để hiện ds order item
			isFirstLoadDone: false,

			gridColumns: [{ caption: "Số lượng", cellTemplate: "quantityTemplate", dataField: "quantity" }],
			//#endregion

			//#endregion

			//#region Api

			//#endregion

			//#region Form sửa/thêm product inventory
			colorFormDataSource: new CustomStore({
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
					return this.colorApi
						.getById(key)
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data[0];
								return { data };
							}
						})
						.catch((err) => console.log(err));
				},
			}),
			sizeFormDataSource: new CustomStore({
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
				byKey: () => {
					return {};
				},
			}),
			//#endregion
		};
	},
	props: {},
	computed: {
		title() {
			return "Chi tiết đơn hàng";
		},
	},
	methods: {},
	watch: {},
	mounted() {
		this.orderId = Number(this.$route.params.id);
		if (this.orderId > 0) {
			OrderApi.getById(this.orderId)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.model = res.data.data[0];
					}
				})
				.catch((err) => {
					this.$showError();
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

.v-form-group {
	margin-bottom: 16px;
}
</style>
