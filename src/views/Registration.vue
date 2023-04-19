<template>
	<div id="registrationComponent">
		<div class="container">
			<DxValidationGroup name="registrationGroup">
				<h1 class="header">Đăng ký tài khoản</h1>
				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Tên tài khoản <span class="required"></span></label>
					<DxTextBox placeholder="Tên tài khoản" v-model="model.userName">
						<DxValidator>
							<DxRequiredRule :message="errorMessage.userName.required" />
							<DxPatternRule
								:pattern="rule.userName.minLength"
								:message="errorMessage.userName.minLength"
							/>
						</DxValidator>
					</DxTextBox>
				</div>

				<!-- mật khẩu -->
				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Mật khẩu <span class="required"></span></label>
					<DxTextBox placeholder="Nhập mật khẩu" v-model="model.password" mode="password">
						<DxValidator>
							<DxRequiredRule :message="errorMessage.password.required" />
							<DxPatternRule
								:pattern="rule.password.minLength"
								:message="errorMessage.password.minLength"
							/>
						</DxValidator>
					</DxTextBox>
				</div>

				<!-- nhập lại mật khẩu -->
				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Nhập lại mật khẩu <span class="required"></span></label>
					<DxTextBox placeholder="Nhập mật khẩu" v-model="model.passwordConfirm" mode="password">
						<DxValidator>
							<DxRequiredRule :message="errorMessage.passwordConfirm.required" />
							<DxCustomRule
								:message="errorMessage.passwordConfirm.match"
								:reevaluate="false"
								:validationCallback="validatePasswordConfirm"
							/>
						</DxValidator>
					</DxTextBox>
				</div>

				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Email</label>
					<DxTextBox>
						<DxValidator>
							<DxEmailRule :message="errorMessage.email.email" />
						</DxValidator>
					</DxTextBox>
				</div>

				<div class="v-form-group mt-3">
					<label for="" class="v-form-label">Số điện thoại</label>
					<DxTextBox placeholder="Ví dụ: 0343333999">
						<DxValidator>
							<DxPatternRule :pattern="rule.phone.pattern" :message="errorMessage.phone.pattern" />
						</DxValidator>
					</DxTextBox>
				</div>

				<div class="btn-wrapper">
					<DxButton :element-attr="{ class: 'mt-4' }" text="Đăng ký" @click="handleRegistration" />
				</div>

				<div class="more-action-wrapper mt-4">
					<router-link to="/"><u>Trang chủ</u></router-link>
					<div class="">
						Bạn đã có tài khoản?

						<router-link to="/login"><u>Đăng nhập</u></router-link>
					</div>
				</div>
			</DxValidationGroup>
		</div>
	</div>
</template>

<script>
import DxTextBox from "devextreme-vue/text-box";
import DxValidator, {
	DxAsyncRule,
	DxRequiredRule,
	DxEmailRule,
	DxPatternRule,
	DxCustomRule,
} from "devextreme-vue/validator";
import AuthenticationApi from "@/apis/authentication-api";
import DxValidationGroup from "devextreme-vue/validation-group";
import DxButton from "devextreme-vue/button";

export default {
	components: {
		DxTextBox,
		DxValidator,
		DxRequiredRule,
		DxPatternRule,
		DxValidationGroup,
		DxEmailRule,
		DxButton,
		DxAsyncRule,
		DxCustomRule,
	},
	data() {
		return {
			model: {}, // chứa thông tin đăng nhập: user name, password

			//#region Form setup
			errorMessage: {
				userName: {
					required: "Vui lòng nhập tên tài khoản",
					minLength: "Tên tài khoản cần tối thiểu 4 ký tự",
				},
				password: {
					required: "Vui lòng nhập mật khẩu",
					minLength: "Mật khẩu cần tối thiếu 8 ký tự",
				},
				passwordConfirm: {
					required: "Vui lòng nhập xác nhân mật khẩu",
					match: "Mật khẩu xác nhận không khớp với mật khẩu",
				},
				email: {
					email: "Email chưa đúng định dạng",
				},
				phone: {
					pattern: "Số điện thoại chưa đúng định dạng",
				},
			},
			rule: {
				phone: {
					pattern: /^0\d{9}$/,
				},
				userName: {
					minLength: /^\w{4,}$/,
				},
				password: {
					minLength: /^.{8,}$/,
				},
				passwordConfirm: {
					// match: "Vui lòng nhập xác nhân mật khẩu",
				},
			},

			//#endregion
		};
	},
	props: {},
	computed: {},
	methods: {
		validatePasswordConfirm(e) {
			const passwordConfirm = e.value;
			const password = this.model.password;
			if (passwordConfirm === password) return true;
			return false;
		},
		/**
		 * xử lý sự kiện đăng ký tài khoản
		 */
		handleRegistration(e) {
			let result = e.validationGroup.validate();
			if (result.isValid) {
				// Submit values to the server
				AuthenticationApi.doRegistration(this.model)
					.then((res) => {
						if (res.data.isSuccessful) {
							this.$router.push({
								name: this.$routeNameEnum.Login,
							});
							this.$showSuccess("Đăng ký thành công");
						} else {
							const errorMessage = res.data.errorMessage;
							this.$showError(errorMessage);
						}
					})
					.catch((err) => {
						this.$showError("Đăng ký thất bại");
					});
			}
		},
		validateUserNameAsync(params) {},
		validateEmailAsync(params) {},
	},
};
</script>

<style scoped lang="scss">
#registrationComponent {
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

.required {
	&::after {
		content: "(*)";
		color: red;
	}
}
</style>
