<template>
	<div id="adminProductDetail" class="">
		<h1 class="mb-3">{{ title }}</h1>

		<div class="main-content">
			<!-- tên sp chính -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Tên sản phẩm <span class="required"></span></label>
				<DxTextBox v-model="model.name" width="30vw">
					<DxValidator>
						<DxRequiredRule :message="errorMessage.name.required" />
					</DxValidator>
				</DxTextBox>
			</div>

			<!-- hãng -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Hãng</label>
				<DxSelectBox
					display-expr="name"
					placeholder="Chọn hãng"
					v-model="model.brand"
					:data-source="brandDataSource"
					width="30vw"
					@valueChanged="handleBrandChanged"
				>
					<DxValidator>
						<DxRequiredRule :message="errorMessage.price.required" />
					</DxValidator>
				</DxSelectBox>
			</div>

			<!-- mô tả -->
			<div class="v-form-group">
				<label for="" class="v-form-label">Mô tả</label>
				<DxTextBox v-model="model.description" width="30vw" />
			</div>

			<!-- trạng thái -->
			<div class="v-form-group">
				<DxCheckBox text="Trạng thái active" v-model="model.isActive" />
			</div>

			<!-- Là sản phẩm mới về -->
			<div class="v-form-group">
				<DxCheckBox text="Là sản phẩm mới về" v-model="model.isHot" />
			</div>

			<!-- là sản phẩm bán chạy -->
			<div class="v-form-group">
				<DxCheckBox text="Là sản phẩm bán chạy" v-model="model.isBestSeller" />
			</div>

			<!-- danh sách ảnh của sp (cho phép chọn 1 ảnh làm avatar) -->
			<div class="v-form-group image-gallery-wrapper">
				<label for="" class="v-form-label">Ảnh</label>
				<div class="list-image">
					<template v-for="(image, index) in model.images" :key="index">
						<div class="img-parent" v-show="image.modelState != modelState.delete">
							<img :src="'data:image/jpeg;base64,' + image.content" alt="an image" width="120" />
							<div class="delete-icon" @click="deleteImage(image)">&times;</div>
							<div class="set-avatar">Đặt làm avatar</div>
						</div>
					</template>
				</div>
				<!-- <dx-button text="Thêm ảnh" :elementAttr="{ class: 'btn-add-image' }"></dx-button> -->
				<input
					type="file"
					accept="image/png, image/jpeg"
					id="productImages"
					name="productImages"
					multiple
					@change="handleInputFileChanged"
					ref="imageFiles"
				/>
			</div>

			<output id="list"></output>

			<!-- danh sách sp con của sp chính -->
			<div class="v-form-group main-list">
				<label for="" class="v-form-label">Danh sách sản phẩm</label>
				<dx-data-grid
					:data-source="gridDataSource"
					:columns="gridColumns"
					:show-borders="true"
					:height="'40vh'"
					:hover-state-enabled="true"
					:remote-operations="true"
					noDataText="Không có dữ liệu"
					@row-click="handleDataRowClicked"
				>
					<template #colorTemplate="{ data }">
						{{ data.data.color?.name }}
					</template>
					<template #sizeTemplate="{ data }">
						{{ data.data.size?.name }}
					</template>
					<template #statusTemplate="{ data }">
						{{ data.data.isActive ? "Đang active" : "Ngừng active" }}
					</template>
					<template #genderTemplate="{ data }">
						{{ getGenderText(data.data.gender) }}
					</template>
					<!-- paging -->

					<!-- editing -->
					<DxEditing :allow-updating="true" :allow-adding="true" :allow-deleting="true" mode="popup">
						<DxPopup :show-title="true" :width="700" :height="600" title="Sản phẩm con" />
						<DxForm>
							<DxItem :col-count="1" :col-span="2" item-type="group">
								<DxItem data-field="name" />
								<DxItem data-field="rrPrice" />
								<DxItem data-field="sellPrice" />
								<DxItem data-field="quantity" />
								<DxItem
									data-field="gender"
									editor-type="dxSelectBox"
									:label="{ text: 'Giới tính' }"
									:editor-options="{ items: genders, displayExpr: 'name', valueExpr: 'id' }"
								/>
								<DxItem
									data-field="color"
									:label="{ text: 'Màu' }"
									editor-type="dxSelectBox"
									:editor-options="{
										dataSource: colorFormDataSource,
										displayExpr: 'name',
									}"
								/>
								<DxItem
									data-field="size"
									:label="{ text: 'Size' }"
									editor-type="dxSelectBox"
									:editor-options="{
										dataSource: sizeFormDataSource,
										displayExpr: 'name',
									}"
								/>
								<DxItem
									data-field="isActive"
									:label="{ text: 'Trạng thái' }"
									editor-type="dxCheckBox"
								/>
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
			<dx-button text="Lưu thay đổi" @click="handleSave" :elementAttr="{ class: 'my-5' }"></dx-button>
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import BaseApi from "@/apis/base-api";
import DxTextBox from "devextreme-vue/text-box";
import CustomStore from "devextreme/data/custom_store";
import AdminProductApi from "@/apis/admin/admin-product-api";
import DxButton from "devextreme-vue/button";
import DataSource from "devextreme/data/data_source";
import DxValidator, { DxRequiredRule, DxPatternRule } from "devextreme-vue/validator";
import DxValidationGroup from "devextreme-vue/validation-group";
import { GenderEnum } from "@/enums/gender-enum";
import AdminProductInventoryApi from "@/apis/admin/admin-product-inventory-api.js";
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
import { Genders } from "@/constants/array/genders";
import { ModelState } from "@/enums/model-state";
import axios from "@/apis/axios";

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
			productId: 0, // id của sản phẩm
			modelState: ModelState,
			editMode: ModelState.insert,

			//#region Validation
			errorMessage: {
				name: {
					required: "Tên sản phẩm không được để trống",
				},
				price: {
					required: "Giá không được để trống",
				},
			},

			//#region Product inventory
			initialDataSource: [], // dùng để hiện ds product inventory
			isFirstLoadDone: false,

			pagingRequest: { pageSize: 15, pageIndex: 0, productId: this.productId },
			gridDataSource: new DataSource({
				store: new CustomStore({
					key: "id",
					load: () => {
						// trường hợp cập nhật
						if (this.productId > 0) {
							if (this.isFirstLoadDone == false) {
								return AdminProductInventoryApi.getPaging(this.pagingRequest)
									.then((res) => {
										if (res.data.isSuccessful) {
											this.isFirstLoadDone = true;

											const resultData = res.data.data[0].items.map((productInventory) => {
												productInventory.modelState = this.modelState.none;
												return productInventory;
											});
											const data = resultData;
											const totalCount = res.data.data[0].totalRecord;

											this.initialDataSource = data; // TODO: clone deep

											return {
												data,
												totalCount,
											};
										} else {
											// toast
											return {
												data: [],
												totalCount: 0,
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
							} else {
								const myPromise = new Promise((resolve, reject) => {
									setTimeout(() => {
										const initialVisibleDataSource = this.initialDataSource.filter(
											(productInventory) => productInventory.modelState != this.modelState.delete
										);
										resolve({
											data: initialVisibleDataSource,
											totalCount: initialVisibleDataSource.length,
										});
									}, 0);
								}).then((res) => res);
								return myPromise;
							}
						}
						// trường hợp thêm
						else {
							const myPromise = new Promise((resolve, reject) => {
								setTimeout(() => {
									const initialVisibleDataSource = this.initialDataSource.filter(
										(productInventory) => productInventory.modelState != this.modelState.delete
									);
									resolve({
										data: initialVisibleDataSource,
										totalCount: initialVisibleDataSource.length,
									});
								}, 0);
							}).then((res) => res);
							return myPromise;
						}
					},
					remove: (key) => {
						const index = this.initialDataSource.findIndex((item) => item.id == key);
						this.initialDataSource[index].modelState = this.modelState.delete;

						this.gridDataSource.reload(); // gọi lại hàm load
					},
					update: (key, values) => {
						values.productId = this.productId;
						if (values.isActive == null) {
							// nếu ko đụng gì đến thì auto là true
							values.isActive = true;
						}

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
						values.productId = this.productId;
						if (values.isActive == null) {
							// nếu ko đụng gì đến thì auto là true
							values.isActive = true;
						}

						values.modelState = this.modelState.create;
						values.id = new Date().getTime();

						this.initialDataSource.push(values);
						this.gridDataSource.reload();
						console.log("initialDataSource: ", this.initialDataSource);
					},
				}),
			}),
			gridColumns: [
				{ caption: "Tên sản phẩm con", dataType: "string", dataField: "name" },
				{ caption: "SKU", dataType: "string", dataField: "sku" },
				{
					caption: "Giá nhà CC đề xuất",
					dataType: "number",
					dataField: "rrPrice",
					width: 100,
					format: { style: "currency", currency: "vnd" },
				},
				{
					caption: "Giá bán",
					dataType: "number",
					dataField: "sellPrice",
					width: 100,
					format: { style: "currency", currency: "vnd" },
				},
				{ caption: "Số lượng có", dataType: "number", dataField: "quantity", width: 100 },
				{ caption: "Giới tính", cellTemplate: "genderTemplate", width: 100, dataField: "gender" },
				{ caption: "Màu", cellTemplate: "colorTemplate", dataField: "color" },
				{ caption: "Size", cellTemplate: "sizeTemplate", dataField: "size" },
				{ caption: "Trạng thái", cellTemplate: "statusTemplate", width: 120, dataField: "isActive" },
			],
			//#endregion

			//#endregion

			//#region Api

			brandApi: new BaseApi("AdminBrands"),
			colorApi: new BaseApi("AdminColors"),
			sizeApi: new BaseApi("AdminSizes"),

			brandDataSource: new CustomStore({
				key: "id",
				load: (loadOptions) => {
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
				byKey: () => {
					return {};
				},
			}),
			//#endregion

			//#region Form sửa/thêm product inventory
			genders: Genders,
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

			imageFiles: null, // danh sach file ảnh gửi lên api khi tạo sản phẩm
		};
	},
	props: {},
	computed: {
		title() {
			if (this.productId > 0) return "Sửa";
			return "Thêm";
		},
	},
	methods: {
		/**
		 * xử lý khi 1 input file chọn file mới
		 */
		handleInputFileChanged(e) {
			const files = e.target.files;
			this.imageFiles = files;
		},
		/**
		 * xử lý dữ liệu model trước khi gửi lên api
		 */
		processPayload() {
			const finalProductInventories = this.initialDataSource.map((productInventory) => {
				if (productInventory.modelState == this.modelState.create) delete productInventory.id;
				return productInventory;
			});
			this.model.productInventories = finalProductInventories;
			console.log({
				finalProductInventories,
			});
		},
		handleSave(e) {
			let result = e.validationGroup.validate();
			if (result.isValid) {
				this.processPayload();
				console.log(this.model);
				if (this.productId > 0) {
					//update
					AdminProductApi.update(this.productId, this.model)
						.then((res) => {
							if (res.data.isSuccessful) {
								this.isFirstLoadDone = false;
								this.gridDataSource.reload();

								this.$showSuccess("Cập nhật thành công");
							}
						})
						.catch((err) => {
							let errorMessage = "Có lỗi xảy ra";
							if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
							else if (err.response.status == 403)
								errorMessage = "Bạn không có quyền thực hiện chức năng này";
							this.$showError(errorMessage);
						});
				} else {
					// create
					AdminProductApi.create(this.model)
						.then((res) => {
							if (res.data.isSuccessful) {
								// goi api them anh
								const newlyCreatedProductId = res.data.data[0].id;
								const formData = new FormData();
								for (var i = 0; i < this.$refs.imageFiles.files.length; i++) {
									let file = this.$refs.imageFiles.files[i];
									formData.append("files[" + i + "]", file);
								}
								axios
									.post("AdminProducts/images/" + newlyCreatedProductId, formData, {
										headers: {
											"Content-Type": "multipart/form-data",
										},
									})
									.then((response) => {
										if (response.data.isSuccessful) {
											this.$showSuccess("Thêm thành công");
											this.$router.push({ name: this.$routeNameEnum.AdminProductList });
										} else this.$showError();
									})
									.catch((error) => {
										let errorMessage = "Có lỗi xảy ra";
										if (err.response.status == 401)
											errorMessage = "Bạn không có quyền thực hiện chức năng này";
										else if (err.response.status == 403)
											errorMessage = "Bạn không có quyền thực hiện chức năng này";
										this.$showError(errorMessage);
									});
							} else this.$showError();
						})
						.catch((err) => {
							let errorMessage = "Có lỗi xảy ra";
							if (err.response.status == 401) errorMessage = "Bạn không có quyền thực hiện chức năng này";
							else if (err.response.status == 403)
								errorMessage = "Bạn không có quyền thực hiện chức năng này";
							this.$showError(errorMessage);
						});
				}
			}
		},
		/**
		 * lấy ra text hiển thị dựa vào giá trị số của gender
		 * @param {*} gender
		 */
		getGenderText(gender = 0) {
			switch (gender) {
				case GenderEnum.Male:
					return "Nam";
				case GenderEnum.Female:
					return "Nữ";
				case GenderEnum.Unisex:
					return "Unisex";
				default:
					return "Không xác định";
			}
		},
		/**
		 * xoá ảnh (bản chất là ko xoá hẳn mà chỉ ẩn đi)
		 */
		deleteImage(image) {
			const deleteImageIndex = this.model.images.findIndex((img) => img.id == image.id);
			const deleteImage = this.model.images[deleteImageIndex];
			deleteImage.modelState = this.modelState.delete;
		},
	},
	watch: {
		/**
		 * vì productId được khởi tạo sau pagingRequest
		 * biến này sẽ chỉ đc watch 1 lần - tức là các dòng lệnh trong này có ý nghĩa setup ban đầu
		 */
		productId(value) {
			this.pagingRequest.productId = value;

			this.gridDataSource = new DataSource({
				store: new CustomStore({
					key: "id",
					load: () => {
						// trường hợp cập nhật
						if (this.productId > 0) {
							if (this.isFirstLoadDone == false) {
								return AdminProductInventoryApi.getPaging(this.pagingRequest)
									.then((res) => {
										if (res.data.isSuccessful) {
											this.isFirstLoadDone = true;

											const resultData = res.data.data[0].items.map((productInventory) => {
												productInventory.modelState = this.modelState.none;
												return productInventory;
											});
											const data = resultData;
											const totalCount = res.data.data[0].totalRecord;

											this.initialDataSource = data; // TODO: clone deep

											return {
												data,
												totalCount,
											};
										} else {
											// toast
											return {
												data: [],
												totalCount: 0,
											};
										}
									})
									.catch((err) => {
										console.log(err);
									});
							} else {
								const myPromise = new Promise((resolve, reject) => {
									setTimeout(() => {
										const initialVisibleDataSource = this.initialDataSource.filter(
											(productInventory) => productInventory.modelState != this.modelState.delete
										);
										resolve({
											data: initialVisibleDataSource,
											totalCount: initialVisibleDataSource.length,
										});
									}, 0);
								}).then((res) => res);
								return myPromise;
							}
						}
						// trường hợp thêm
						else {
							const myPromise = new Promise((resolve, reject) => {
								setTimeout(() => {
									resolve({
										data: [],
										totalCount: 0,
									});
								}, 0);
							}).then((res) => res);
							return myPromise;
						}
					},
					remove: (key) => {
						const index = this.initialDataSource.findIndex((item) => item.id == key);
						this.initialDataSource[index].modelState = this.modelState.delete;

						this.gridDataSource.reload(); // gọi lại hàm load
					},
					update: (key, values) => {
						values.productId = this.productId;
						if (values.isActive == null) {
							// nếu ko đụng gì đến thì auto là true
							values.isActive = true;
						}

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
						values.productId = this.productId;
						if (values.isActive == null) {
							// nếu ko đụng gì đến thì auto là true
							values.isActive = true;
						}

						values.modelState = this.modelState.create;
						values.id = new Date().getTime();

						this.initialDataSource.push(values);
						this.gridDataSource.reload();
						console.log("initialDataSource: ", this.initialDataSource);
					},
				}),
			});
			if (value > 0) {
				this.editMode = this.modelState.update;
			} else {
				this.editMode = this.modelState.create;
			}
		},
	},
	mounted() {
		this.productId = Number(this.$route.params.id);
		if (this.productId > 0) {
			AdminProductApi.getById(this.productId)
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
#adminProductDetail {
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
