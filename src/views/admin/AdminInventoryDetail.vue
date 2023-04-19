<template>
	<div id="adminInventoryDetail" class="">
		<h1 class="mb-3">{{ title }}</h1>

		<div class="main-content">
			<!-- mã phiếu nhập -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Mã phiếu nhập <span class="required"></span></label>
				<DxTextBox v-model="model.supplyCode" :read-only="editMode != modelState.create" width="30vw">
					<DxValidator>
						<DxRequiredRule :message="errorMessage.supplyCode.required" />
					</DxValidator>
				</DxTextBox>
			</div>

			<!-- nhà cung cấp -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Nhà cung cấp</label>
				<DxSelectBox
					display-expr="name"
					placeholder="Chọn nhà cung cấp"
					v-model="model.supplier"
					:data-source="supplierDataSource"
					width="30vw"
					@valueChanged="handleSupplierChanged"
					:read-only="editMode != modelState.create"
				>
					<DxValidator>
						<DxRequiredRule :message="errorMessage.supplier.required" />
					</DxValidator>
				</DxSelectBox>
			</div>

			<!-- Ngày nhập -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Ngày nhập</label>
				<DxDateBox v-model="model.supplyDate" :read-only="editMode != modelState.create" width="30vw">
					<DxValidator> <DxRequiredRule :message="errorMessage.supplyDate.required" /> </DxValidator
				></DxDateBox>
			</div>

			<!-- danh sách sp con của sp chính -->
			<div class="v-form-group main-list">
				<label for="" class="v-form-label">Danh sách sản phẩm nhập</label>
				<dx-data-grid
					:data-source="gridDataSource"
					:columns="gridColumns"
					:show-borders="true"
					:height="'40vh'"
					:hover-state-enabled="true"
					:remote-operations="true"
					noDataText="Không có dữ liệu"
				>
					<template #productInventoryNameTemplate="{ data }">
						{{ data.data.productInventory.name }}
					</template>
					<template #SKUTemplate="{ data }">
						{{ data.data.productInventory.sku }}
					</template>
					<!-- <template #totalPriceTemplate="{ data }">
						{{ getTotalPriceEachProductSupplyBill(data.data) }}
					</template> -->

					<!-- editing -->
					<DxEditing
						v-if="editMode == modelState.create"
						:allow-updating="true"
						:allow-adding="true"
						:allow-deleting="true"
						mode="popup"
					>
						<DxPopup :show-title="true" :width="700" :height="400" title="Sản phẩm nhập" />
						<DxForm>
							<DxItem :col-count="1" :col-span="2" item-type="group">
								<DxItem
									data-field="productInventory"
									:label="{ text: 'Sản phẩm' }"
									editor-type="dxSelectBox"
									:editor-options="{
										dataSource: productInventoryFormDataSource,
										displayExpr: 'name',
										searchEnabled: true,
									}"
								/>
								<!-- VALIDATE form nhap -->
								<DxItem data-field="price" />
								<DxItem data-field="quantity" />
								<DxItem data-field="discount" />
							</DxItem>
						</DxForm>
					</DxEditing>

					<!-- scrolling -->
					<DxScrolling mode="standard" />

					<!-- paging -->
					<DxPaging :page-size="pagingRequest.pageSize" />
					<DxPager :show-page-size-selector="true" :allowed-page-sizes="[15, 25, 50]" />
				</dx-data-grid>
			</div>

			<!-- button luu -->
			<dx-button
				v-if="editMode == modelState.create"
				text="Lưu thay đổi"
				@click="handleSave"
				:elementAttr="{ class: 'my-5' }"
			></dx-button>
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import BaseApi from "@/apis/base-api";
import DxTextBox from "devextreme-vue/text-box";
import DxDateBox from "devextreme-vue/date-box";
import CustomStore from "devextreme/data/custom_store";
import AdminProductApi from "@/apis/admin/admin-product-api";
import DxButton from "devextreme-vue/button";
import DataSource from "devextreme/data/data_source";
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
import adminSupplyBillApi from "../../apis/admin/admin-supply-bill-api";

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
		DxDateBox,
	},
	data() {
		return {
			model: {}, // đối tượng phiếu nhập
			supplyBillId: 0, // id của phiếu nhập
			modelState: ModelState,
			editMode: ModelState.insert,

			//#region Validation
			errorMessage: {
				supplyCode: {
					required: "Mã phiếu nhập không được để trống",
				},
				supplier: {
					required: "Nhà cung cấp không được để trống",
				},
				supplyDate: {
					required: "Ngày nhập không được để trống",
				},
			},

			//#region Supply bill item
			initialDataSource: [], // dùng để hiện ds supply bill item
			isFirstLoadDone: false,

			pagingRequest: { pageSize: 15, pageIndex: 0 },
			gridDataSource: new DataSource({
				store: new CustomStore({
					key: "id",
					load: () => {
						const myPromise = new Promise((resolve, reject) => {
							setTimeout(() => {
								const initialVisibleDataSource = this.initialDataSource.filter(
									(supplyBill) => supplyBill.modelState != this.modelState.delete
								);
								resolve({
									data: initialVisibleDataSource,
									totalCount: initialVisibleDataSource.length,
								});
							}, 0);
						}).then((res) => res);
						return myPromise;
					},
					remove: (key) => {
						const index = this.initialDataSource.findIndex((item) => item.id == key);
						this.initialDataSource[index].modelState = this.modelState.delete;

						this.gridDataSource.reload(); // gọi lại hàm load
					},
					update: (key, values) => {
						values.supplyBillId = this.supplyBillId;

						const index = this.initialDataSource.findIndex((item) => item.id == key);
						this.initialDataSource[index] = {
							...this.initialDataSource[index],
							...values,
							modelState: this.modelState.update,
							id: key,
						};

						this.gridDataSource.reload();

						console.log("update: ", this.initialDataSource[index]);
					},
					insert: (values) => {
						values.supplyBillId = this.supplyBillId;
						values.isActive = true;

						values.modelState = this.modelState.create;
						values.id = new Date().getTime();

						this.initialDataSource.push(values);
						this.gridDataSource.reload();
						console.log("initialDataSource: ", this.initialDataSource);
					},
				}),
			}),
			gridColumns: [
				{
					caption: "Tên sản phẩm",
					dataType: "string",
					cellTemplate: "productInventoryNameTemplate",
					dataField: "productInventory",
				},
				{ caption: "SKU", dataType: "string", cellTemplate: "SKUTemplate" },
				{ caption: "Số lượng", dataField: "quantity", dataType: "number", width: 100 },
				{
					caption: "Giá",
					dataField: "price",
					dataType: "number",
					format: { style: "currency", currency: "vnd" },
				},
				{ caption: "Giảm giá (%)", dataField: "discount", dataType: "number", width: 100 },
				{
					caption: "Tổng tiền",
					dataType: "number",
					format: { style: "currency", currency: "vnd" },
					calculateCellValue: this.getTotalPriceEachProductSupplyBill,
				},
			],
			//#endregion

			//#region Api

			supplierApi: new BaseApi("AdminSuppliers"),

			supplierDataSource: new CustomStore({
				key: "id",
				load: (loadOptions) => {
					return this.supplierApi
						.getAll()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalCount: data.length };
							}
						})
						.catch((err) => {
							let errorMessage = "Có lỗi xảy ra";
							if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
							else if (err.response.status == 403)
								errorMessage = "Bạn không có quyền thực hiện chức năng này";
							this.$showError(errorMessage);
						});
				},
				byKey: () => {
					return {};
				},
			}),

			productInventoryApi: new BaseApi("AdminProductInventories"),
			productInventoryFormDataSource: new CustomStore({
				key: "id",
				load: (loadOptions) => {
					return this.productInventoryApi
						.getAll()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalCount: data.length };
							}
						})
						.catch((err) => {
							let errorMessage = "Có lỗi xảy ra";
							if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
							else if (err.response.status == 403)
								errorMessage = "Bạn không có quyền thực hiện chức năng này";
							this.$showError(errorMessage);
						});
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
			if (this.supplyBillId > 0) return "Chi tiết phiếu nhập";
			return "Thêm phiếu nhập";
		},
		editMode() {
			if (this.supplyBillId > 0) {
				return this.modelState.none;
			}
			return this.modelState.create;
		},
	},
	methods: {
		/**
		 * xử lý dữ liệu model trước khi gửi lên api
		 */
		processPayload() {
			const finalProductSupplyBills = this.initialDataSource.map((productSupplyBill) => {
				if (productSupplyBill.modelState == this.modelState.create) delete productSupplyBill.id;
				return productSupplyBill;
			});
			this.model.supplyBillItems = finalProductSupplyBills;
			console.log({
				finalProductInventories: finalProductSupplyBills,
			});
		},
		handleSave(e) {
			let result = e.validationGroup.validate();
			if (result.isValid) {
				this.processPayload();
				// create
				adminSupplyBillApi
					.create(this.model)
					.then((res) => {
						if (res.data.isSuccessful) {
							this.$showSuccess("Thêm thành công");

							this.$router.push({ name: this.$routeNameEnum.AdminInventoryList });
						}
					})
					.catch((err) => {
						let errorMessage = "Có lỗi xảy ra";
						if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
						else if (err.response.status == 403)
							errorMessage = "Bạn không có quyền thực hiện chức năng này";
						this.$showError(errorMessage);
					});
			}
		},
		/**
		 * tính tổng tiền của mỗi sản phẩm trong phiếu nhập
		 */
		getTotalPriceEachProductSupplyBill(productSupplyBill) {
			if (productSupplyBill.discount > 0) {
				return (
					(productSupplyBill.quantity * productSupplyBill.price * (100 - productSupplyBill.discount)) / 100
				);
			}
			return productSupplyBill.quantity * productSupplyBill.price;
		},
	},
	watch: {},
	mounted() {
		this.supplyBillId = Number(this.$route.params.id);
		if (this.supplyBillId > 0) {
			adminSupplyBillApi
				.getById(this.supplyBillId)
				.then((res) => {
					if (res.data.isSuccessful) {
						this.model = res.data.data[0];
						this.initialDataSource = this.model.supplyBillItems;
						this.gridDataSource.reload();
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
#adminInventoryDetail {
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
