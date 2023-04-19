<template>
	<div id="dashBoard" class="">
		<div class="top-utility">
			<h1 class="header">Thống kê</h1>
		</div>

		<!-- doanh thu  -->
		<section class="statistic-section revenue-section row">
			<div class="col-6 revenue-statistic-col">
				<div class="revenue-statistic">
					<div class="section-title">Doanh thu</div>
					<!-- doanh thu hôm nay -->
					<div class="revenue-today mt-4">
						Doanh thu hôm nay: <span class="price">{{ revenueToday }}</span>
					</div>

					<!-- doanh thu tuần này -->
					<div class="revenue-today mt-4 mb-5">Doanh thu tuần này:</div>

					<DxChart id="revenueByWeekDataSource" :data-source="revenueByWeekDataSource" width="30vw">
						<DxSeries
							argument-field="day"
							value-field="value"
							name="Doanh thu tuần này"
							type="bar"
							color="#ffaa66"
						/>
					</DxChart>
				</div>
			</div>
			<div class="col-6 revenue-statistic-col">
				<div class="revenue-statistic">
					<div class="section-title">Đơn hàng</div>
					<div class="revenue-today mt-4">Số đơn hàng mới hôm nay: <span class="price">15</span></div>

					<div class="revenue-today mt-4 mb-5">Số đơn hàng mới tuần này:</div>

					<DxChart id="orderByWeekDataSource" :data-source="orderByWeekDataSource" width="30vw">
						<DxSeries
							argument-field="day"
							value-field="value"
							name="Đơn hàng mới tuần này"
							type="bar"
							color="#ffaa66"
						/>
					</DxChart>
				</div>
			</div>
		</section>
		<!-- end doanh thu -->

		<div class="row my-4">
			<div class="col-6">
				<!-- san pham ban chay -->
				<section class="statistic-section revenue-statistic best-seller-products-section">
					<div class="section-title">Sản phẩm bán chạy nhất</div>
					<div class="section content">
						<dx-data-grid
							:data-source="gridDataSource"
							:columns="gridColumns"
							:show-borders="true"
							:hover-state-enabled="true"
							noDataText="Không có dữ liệu"
							height="40vh"
							@row-click="handleDataRowClicked"
						>
							<template #productImage="{ data }">
								<img :src="'data:image/jpeg;base64,' + data.data.images[0]?.content" :width="100" />
							</template>
						</dx-data-grid>
					</div>
				</section>
				<!-- end san pham ban chay -->
			</div>
			<div class="col-6">
				<!-- hàng tồn -->
				<section class="statistic-section revenue-statistic best-seller-products-section">
					<div class="section-title">Sản phẩm tồn nhiều nhất</div>
					<div class="section content">
						<dx-data-grid
							:data-source="gridBestInventoryDataSource"
							:columns="gridBestInventoryColumns"
							:show-borders="true"
							:hover-state-enabled="true"
							noDataText="Không có dữ liệu"
							height="40vh"
							@row-click="handleDataRowClicked"
						>
							<template #productImage="{ data }">
								<img :src="'data:image/jpeg;base64,' + data.data.images[0]?.content" :width="100" />
							</template>
						</dx-data-grid>
					</div>
				</section>
				<!-- end hàng tồn -->
			</div>
		</div>
	</div>
</template>

<script>
import { DxChart, DxSeries } from "devextreme-vue/chart";
import { DxDataGrid } from "devextreme-vue/data-grid";
import DxButton from "devextreme-vue/button";
import AdminStatisticApi from "@/apis/admin-statistic/admin-statistic-api.js";

export default {
	components: { DxChart, DxSeries, DxDataGrid, DxButton },
	data() {
		return {
			revenueToday: 55000000,
			revenueByWeekDataSource: [
				{
					day: "Thứ 2",
					value: 30000000,
				},
				{
					day: "Thứ 3",
					value: 40000000,
				},
				{
					day: "Thứ 4",
					value: 50000000,
				},
				{
					day: "Thứ 5",
					value: 35000000,
				},
				{
					day: "Thứ 6",
					value: 40000000,
				},
				{
					day: "Thứ 7",
					value: 55000000,
				},
			],

			orderByWeekDataSource: [
				{
					day: "Thứ 2",
					value: 10,
				},
				{
					day: "Thứ 3",
					value: 15,
				},
				{
					day: "Thứ 4",
					value: 22,
				},
				{
					day: "Thứ 5",
					value: 13,
				},
				{
					day: "Thứ 6",
					value: 16,
				},
				{
					day: "Thứ 7",
					value: 25,
				},
			],

			//#region San pham ban chay nhat
			bestSellerPagingRequest: {
				pageIndex: 0,
				pageSize: 5,
				statisticProductType: 1,
			},

			gridDataSource: [],
			gridColumns: [
				{ caption: "Tên sản phẩm", dataType: "string", dataField: "name", minWidth: 300 },
				{
					caption: "Bán được tháng này",
					dataField: "quantitySoldMonth",
					dataType: "number",
				},
			],
			//#endregion

			//#region San pham ton kho nhieu nhat
			bestInventoryPagingRequest: {
				pageIndex: 0,
				pageSize: 5,
				statisticProductType: 2,
			},
			gridBestInventoryColumns: [
				{ caption: "Tên sản phẩm", dataType: "string", dataField: "name", minWidth: 300 },
				{
					caption: "Tồn kho",
					dataField: "quantityInventory",
					dataType: "number",
				},
			],
			gridBestInventoryDataSource: [],
			//#endregion
		};
	},
	props: {},
	computed: {},
	methods: {
		handleDataRowClicked(data) {
			const id = data.data.id;
			this.$router.push({
				name: this.$routeNameEnum.AdminProductDetail,
				params: {
					id: id,
				},
			});
		},
	},
	mounted() {
		AdminStatisticApi.getProducts(this.bestSellerPagingRequest)
			.then((res) => {
				if (res.data.isSuccessful) {
					this.gridDataSource = res.data.data;
				} else this.$showError();
			})
			.catch((err) => this.$showError());

		AdminStatisticApi.getProducts(this.bestInventoryPagingRequest)
			.then((res) => {
				if (res.data.isSuccessful) {
					this.gridBestInventoryDataSource = res.data.data;
				} else this.$showError();
			})
			.catch((err) => this.$showError());
	},
};
</script>

<style scoped lang="scss">
.price {
	font-size: 28px;
	font-weight: 500;
}

.revenue-today {
	font-size: 18px;
	font-weight: 500;
}

.revenue-statistic-col {
}

.revenue-statistic {
	background: #fff;
	border-radius: 4px;
}
.revenue-statistic {
	padding: 24px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
}

.top-utility {
	margin-bottom: 24px;
}

.statistic-section:not(:first-of-type) {
	margin-top: 48px;
}
.section-title {
	font-size: 28px;
	font-weight: 600;
}
</style>
