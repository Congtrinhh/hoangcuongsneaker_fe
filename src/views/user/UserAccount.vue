<template>
	<div id="userAccount" class="">
		<div class="container">
			<div class="header">Tài khoản của bạn</div>

			<div class="user-info-content">
				<div class="title">Tài khoản</div>

				<div @click="handleLogout" class="button-logout">Đăng xuất</div>

				<div class="v-form-group">
					<label for="" class="v-form-label">Tên đăng nhập</label>
					<DxTextBox v-model="model.userName" :read-only="true" />
				</div>

				<div class="v-form-group">
					<label for="" class="v-form-label"> Email </label>
					<DxTextBox v-model="model.email" />
				</div>

				<div class="v-form-group">
					<label for="" class="v-form-label">Số điện thoại </label>
					<DxTextBox v-model="model.phone" />
				</div>

				<div class="v-form-group">
					<label for="" class="v-form-label">Địa chỉ ship hàng</label>
					<DxTextBox v-model="model.address" :read-only="true" />
				</div>
				<div @click="toggleEditAddress" class="button-toggle-edit-address">
					{{ isEditAddressEnabled == true ? "Huỷ" : "Cập nhật địa chỉ" }}
				</div>

				<div v-if="isEditAddressEnabled" class="mt-4 edit-address-wrapper">
					<!-- 3 select box: province - city - ward -->
					<div class="v-form-group">
						<label for="" class="v-form-label">Tỉnh/thành phố - quận huyện - xã phường</label>
						<div class="address-wrapper">
							<DxSelectBox
								ref="provinceRef"
								:data-source="provinceDataSource"
								display-expr="name"
								placeholder="Tỉnh"
								v-model="address.province"
								noDataText="Không có dữ liệu"
								@valueChanged="handleProvinceChanged"
							/>
							<DxSelectBox
								ref="districtRef"
								:data-source="districtDataSource"
								display-expr="name"
								placeholder="Thành phố"
								v-model="address.district"
								noDataText="Không có dữ liệu"
								@valueChanged="handleDistrictChanged"
							/>
							<DxSelectBox
								ref="wardRef"
								:data-source="wardDataSource"
								display-expr="name"
								placeholder="Quận/huyện/xã"
								v-model="address.ward"
								noDataText="Không có dữ liệu"
							/>
						</div>
					</div>
					<!-- specific address -->
					<div class="v-form-group">
						<label class="v-form-label">Địa chỉ cụ thể</label>
						<dx-text-box
							v-model="address.specificAddress"
							ref="specificAddressRef"
							placeholder="Số nhà, tổ dân phố"
						/>
					</div>
				</div>

				<v-button @click="handleSave">Cập nhật</v-button>
			</div>
			<!-- orders -->
		</div>
	</div>
</template>

<script>
import DxSelectBox from "devextreme-vue/select-box";
import DxTextBox from "devextreme-vue/text-box";
import { useIndexStore } from "@/stores";
import OrderApi from "@/apis/user/order-api";
import CustomStore from "devextreme/data/custom_store";
import AdminUserApi from "@/apis/admin/admin-user-api";
import AuthenticationApi from "@/apis/authentication-api";

export default {
	components: { DxTextBox, DxSelectBox },
	data() {
		return {
			model: {}, // thông tin user

			provinceDataSource: new CustomStore({
				key: "id",
				load: () => {
					return OrderApi.getProvinces()
						.then((res) => {
							if (res.data.isSuccessful) {
								let data = res.data.data;
								return { data, totalRecord: data.length };
							}
						})
						.catch((err) => console.log(err));
				},
				byKey: () => {},
			}),
			districtDataSource: [],
			wardDataSource: [],

			address: {}, // địa chỉ giao hàng
			isEditAddressEnabled: false, // có đang ở chố độ chỉnh sửa địa chỉ giao hàng không
		};
	},
	props: {},
	computed: {},
	methods: {
		toggleEditAddress() {
			if (this.isEditAddressEnabled == true) {
				this.$refs.provinceRef.instance.option("value", null);
				this.$refs.districtRef.instance.option("value", null);
				this.$refs.wardRef.instance.option("value", null);
				this.$refs.specificAddressRef.instance.option("value", null);

				this.address = {};
			}

			this.isEditAddressEnabled = !this.isEditAddressEnabled;
		},
		handleProvinceChanged(e) {
			const provinceId = e.value?.id;
			this.districtDataSource = [];
			this.wardDataSource = [];
			OrderApi.getDistricts(provinceId)
				.then((res) => {
					if (res.data.isSuccessful) this.districtDataSource = res.data.data;
				})
				.catch((err) => console.log(err));
		},
		handleDistrictChanged(e) {
			const districtId = e.value?.id;
			OrderApi.getWards(districtId)
				.then((res) => {
					if (res.data.isSuccessful) this.wardDataSource = res.data.data;
				})
				.catch((err) => console.log(err));
		},
		/**
		 * cập nhật user
		 */
		handleSave() {
			const payload = this.getPayload();
			console.log(payload);
			AdminUserApi.update(payload.id, payload)
				.then((res) => {
					if (res.data.isSuccessful) {
						useIndexStore.userInfo = { ...payload };
						this.model = { ...payload };
						localStorage.setItem("userInfo", JSON.stringify(useIndexStore.userInfo));

						this.isEditAddressEnabled = false;

						this.address = {};

						this.$showSuccess("Cập nhật thành công");
					} else this.$showError();
				})
				.catch((err) => this.$showError());
		},
		getPayload() {
			const userPayload = { ...this.model };
			if (this.isEditAddressEnabled == true) userPayload.address = this.getAddress();
			return userPayload;
		},
		getAddress() {
			let address = `${this.address?.specificAddress}, ${this.address?.ward?.name}, ${this.address?.district?.name}, ${this.address?.province?.name}`;
			return address;
		},
		/**
		 * xu ly dang xuat nguoi dung khoi he thong
		 */
		handleLogout() {
			try {
				AuthenticationApi.doLogout();
				this.$router.push({ name: this.$routeNameEnum.Home });
				this.$showSuccess("Đăng xuất thành công");
			} catch (error) {
				this.$showError();
			}
		},
	},
	mounted() {
		this.model = { ...useIndexStore.userInfo };
	},
};
</script>

<style scoped lang="scss">
#userAccount {
	background: #f5f8fd;
	padding-bottom: 30px;
}
.header {
	text-align: center;
	font-size: 25px;
	font-weight: 700;
	margin: 0px 0;
	line-height: initial;

	padding: 40px 0 20px;
}

.user-info-content {
	margin-bottom: 20px;
	background: #ffffff;
	padding: 20px 15px;

	.title {
		text-transform: uppercase;
		margin-bottom: 10px;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 1px;
	}
}

.button-toggle-edit-address {
	cursor: pointer;
	text-decoration: underline;
	margin: 12px 0;
}

.edit-address-wrapper {
	padding: 16px;
	padding-bottom: 0;
	border: 1px dashed #eee;
	border-radius: 4px;
	margin-bottom: 16px;
}

.button-logout {
	cursor: pointer;
	text-decoration: underline;
	margin: 12px 0 16px;
}

.address-wrapper {
	display: flex;
	gap: 16px;
}

// responsive
@media screen and (max-width: 576px) {
	.address-wrapper {
		flex-direction: column;
	}
}
//
</style>
