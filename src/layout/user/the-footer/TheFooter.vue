<template>
	<div id="footer">
		<div class="container">
			<section class="footer-section">
				<div class="footer-section-title">Về Hoangcuongsneaker</div>
				<div class="footer-section-content">
					Hoangcuongsneaker lần đầu tiên xuất hiện tại thành phố đáng sống Đà Nẵng vào năm 2016 với mục đích
					chia sẽ và phát triển niềm đam mê với nền văn hóa "sát mặt đất". Cùng những founder và dàn staff đều
					là những người có cùng sở thích và tình yêu đối với "bộ môn" này, tụi mình đã và đang cố gắng từng
					ngày để có thể giúp cộng đồng này càng ngày càng lớn mạnh hơn. Rất mong sẽ nhận được sự ủng hộ nhiệt
					tình từ các bạn !
				</div>
			</section>

			<section class="footer-section address-section">
				<div class="footer-section-title">&nbsp;</div>
				<div class="footer-section-content address-section-content">
					<div class="address-item"><strong>Địa chỉ</strong>: 339 Đ. Nguyễn Hoàng, Bắc Từ Liêm, Hà Nội</div>
					<div class="address-item"><strong>Điện thoại</strong>: 0788.606.909</div>
					<div class="address-item"><strong>Email</strong>: hoangcuongsneaker@gmail.com</div>
				</div>
			</section>

			<section class="footer-section customer-support-section">
				<div class="footer-section-title">Hỗ trợ khách hàng</div>
				<div class="footer-section-content customer-support-section-content">
					<router-link
						v-for="(customerSupportItem, index) in customerSupportItems"
						:to="customerSupportItem.to"
						:key="index"
					>
						<div class="customer-support-item">{{ customerSupportItem.text }}</div>
					</router-link>
				</div>
			</section>

			<section class="footer-section customer-care-section">
				<div class="footer-section-title">Chăm sóc khách hàng</div>
				<div class="footer-section-content customer-care-section-content">
					<div class="customer-care-row">
						<div class="icon"></div>
						<div class="more-info">
							<div class="phone">0788.606.909</div>
							<div class="email">hoangcuongsneaker@gmail.com</div>
						</div>
					</div>
					<div class="customer-care-row follow">Follow us</div>
					<div class="customer-care-row"><div class="social-item">Facebook</div></div>
				</div>
			</section>
		</div>

		<!-- copyright -->
		<div class="footer-copyright text-center">
			<div class="container">
				<p>Copyright © 2023 <a href="https://h2sneaker.com"> Hoangcuongsneaker</a>.</p>
				<div class="">Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			customerSupportItems: [
				{
					to: "",
					text: "Giới thiệu",
				},
				{
					to: "",
					text: "Chính sách đổi trả",
				},
				{
					to: "",
					text: "Chính sách bảo mật",
				},
				{
					to: "",
					text: "Điều khoản dịch vụ",
				},
				{
					to: "",
					text: "Liên hệ",
				},
			],
		};
	},
	props: {
		pColor: {
			type: String,
			default: "black",
		},
	},
	computed: {},
	methods: {},
};
</script>

<style scoped lang="scss">
#footer {
	background: #333;
	padding: 40px 0 16px 0;
	display: flex;
	flex-direction: column;
	> .container {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 24px;
	}
}
.footer-section {
	color: #eee;
	line-height: 1.6rem;
	flex: 1;
	.footer-section-title {
		font-weight: 700;
		font-size: 18px;
		margin-bottom: 24px;
	}
}

.address-section-content {
	display: flex;
	flex-direction: column;
	row-gap: 8px;
}

.customer-support-section-content {
	display: flex;
	flex-direction: column;
	row-gap: 8px;
	> a:hover {
		text-decoration: underline;
	}
}

.customer-care-section-content {
	display: flex;
	flex-direction: column;
	row-gap: 8px;

	.customer-care-row:first-of-type {
		display: flex;
		align-items: flex-start;
		column-gap: 8px;
	}
	.icon {
	}
	.more-info {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
		.phone {
			font-size: 24px;
			font-weight: 500;
		}
		.email {
			font-size: 16px;
		}
	}

	.customer-care-row.follow {
		font-weight: 700;
		font-size: 18px;
		padding-bottom: 12px;
		margin-top: 20px;
	}

	.customer-care-row:last-of-type {
		display: flex;
		align-items: center;
		gap: 8px;
		.social-item {
			cursor: pointer;
		}
	}
}

.footer-copyright {
	color: #eee;
	align-self: center;
	margin-top: 48px;
}

// responsive
@media screen and (max-width: 992px) {
	#footer {
		> .container {
			flex-wrap: wrap;
		}
	}

	.footer-section {
		flex-basis: 48%;
	}
}

@media screen and (max-width: 576px) {
	#footer {
		> .container {
			flex-direction: column;
		}
	}
}
//
</style>
