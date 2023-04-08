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
					<!-- <v-button class="mt-4" :hover-effect="false" @click="handleLogin">Đăng nhập</v-button> -->
					<dx-button :element-attr="{ class: 'mt-4' }" text="Đăng nhập" @click="handleLogin" />
				</div>

				<div class="more-action-wrapper mt-4">
					<div class="">
						Bạn chưa có tài khoản?

						<router-link to="/registration">Đăng ký</router-link>
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

export default {
	components: { DxTextBox, DxValidator, DxRequiredRule, DxPatternRule, DxValidationGroup, DxButton },
	data() {
		return {
			model: {}, // chứa thông tin đăng nhập: user name, password
		};
	},
	props: {
		pColor: {
			type: String,
			default: "black",
		},
	},
	computed: {},
	methods: {
		/**
		 * xử lý sự kiện login
		 */
		handleLogin(e) {
			let result = e.validationGroup.validate();
			if (result.isValid) {
				// Submit values to the server
				AuthenticationApi.doLogin(this.user)
					.then((res) => {
						debugger;
						if (res.data.isSuccessful) {
							// toast
							// redirect to user/admin default page
						}
					})
					.catch((err) => {
						// toast
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
	> div {
		text-align: right;
	}
}
.header {
	text-align: center;
}
</style>
