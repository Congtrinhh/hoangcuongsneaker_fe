<template>
	<div id="loginComponent">
		<div class="container">
			<DxValidationGroup name="loginGroup">
				<h1 class="header">Đăng nhập</h1>
				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Tên tài khoản</label>
					<DxTextBox placeholder="Tên tài khoản" v-model="model.userName">
						<DxValidator>
							<DxRequiredRule message="Vui lòng nhập tên tài khoản" />
							<DxPatternRule pattern="^\w{4,}$" message="Tên tài khoản cần tối thiểu 4 ký tự" />
						</DxValidator>
					</DxTextBox>
				</div>

				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Mật khẩu</label>
					<DxTextBox placeholder="Nhập mật khẩu" v-model="model.password" mode="password">
						<DxValidator>
							<DxRequiredRule message="Vui lòng nhập mật khẩu" />
							<DxPatternRule pattern="^.{8,}$" message="Mật khẩu cần tối thiếu 8 ký tự" />
						</DxValidator>
					</DxTextBox>
				</div>

				<div class="btn-wrapper">
					<dx-button :element-attr="{ class: 'mt-4' }" text="Đăng nhập" @click="handleLogin" />
				</div>

				<div class="more-action-wrapper mt-4">
					<router-link to="/"><u>Trang chủ</u></router-link>
					<div class="">
						Bạn chưa có tài khoản?

						<router-link to="/registration"><u>Đăng ký</u></router-link>
					</div>
				</div>
			</DxValidationGroup>
		</div>
	</div>
</template>

<script>
import DxTextBox from "devextreme-vue/text-box";
import DxValidator, { DxRequiredRule, DxPatternRule } from "devextreme-vue/validator";
import AuthenticationApi from "@/apis/authentication-api";
import DxValidationGroup from "devextreme-vue/validation-group";
import DxButton from "devextreme-vue/button";
import { useIndexStore } from "@/stores";

export default {
	components: { DxTextBox, DxValidator, DxRequiredRule, DxPatternRule, DxValidationGroup, DxButton },
	data() {
		return {
			model: {}, // chứa thông tin đăng nhập: user name, password
		};
	},
	props: {},
	computed: {},
	methods: {
		/**
		 * xử lý sự kiện login
		 */
		handleLogin(e) {
			let result = e.validationGroup.validate();
			if (result.isValid) {
				// Submit values to the server
				AuthenticationApi.doLogin(this.model)
					.then((res) => {
						if (res.data.isSuccessful) {
							const jwtToken = res.data.data[0];
							const user = res.data.data[1];

							localStorage.setItem("jwtToken", jwtToken); // lưu token vào localStorage
							localStorage.setItem("userInfo", JSON.stringify(user)); // lưu thong tin usesr vào localStorage

							useIndexStore.isLoggedIn = true;
							useIndexStore.userInfo = user;

							this.$showSuccess("Đăng nhập thành công");

							if (user.role == "admin") {
								this.$router.push({
									name: this.$routeNameEnum.AdminDashBoard,
								});
							} else {
								this.$router.push({
									name: this.$routeNameEnum.Home,
								});
							}
						} else {
							const errorMessage = res.data.errorMessage;
							this.$showError(errorMessage);
						}
					})
					.catch((err) => {
						this.$showError("Đăng nhập thất bại");
					});
			}
		},
	},
};
</script>

<style scoped lang="scss">
#loginComponent {
	padding: 20px;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	& > .container {
		border-radius: 4px;
		box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
		padding: 20px;
		transform: translateY(-10vh);
		max-width: 520px;
	}
}
.btn-wrapper {
	display: flex;
	justify-content: center;
}

.more-action-wrapper {
	display: flex;
	align-items: center;
	justify-content: space-between;
	> div {
		text-align: right;
	}
}
.header {
	text-align: center;
}
</style>
