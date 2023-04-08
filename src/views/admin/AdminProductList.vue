<template>
	<div class="" id="adminProductList">
		<div class="top-utility">
			<div class="header">Quản lý sản phẩm</div>
			<dx-button text="Thêm mới" @click="handleAddNewButtonClicked"></dx-button>
			<!-- <div class="search-wrapper"></div> -->
			<!-- dung dx search -->
		</div>
		<div class="main-list">
			<dx-data-grid
				:data-source="gridDataSource"
				:columns="gridColumns"
				:show-borders="true"
				@row-click="handleDataRowClicked"
			>
				<template #productImage="{ data }">
					<img :src="'data:image/jpeg;base64,' + data.data.images[0]?.content" :width="100" />
				</template>

				<dx-editing :allow-deleting="true" mode="row" />
				<!-- paging -->
			</dx-data-grid>
		</div>
	</div>
</template>

<script>
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import AdminProductApi from "@/apis/admin/admin-product-api.js";
import { DxDataGrid, DxEditing } from "devextreme-vue/data-grid";
import DxButton from "devextreme-vue/button";
import { RouteNameEnum } from "@/enums/route-name-enum";

export default {
	components: { DxDataGrid, DxButton, DxEditing },
	data() {
		return {
			pagingRequest: { pageSize: 25, pageIndex: 0 },
			gridDataSource: new DataSource({
				store: new CustomStore({
					key: "id",
					load: () => {
						return AdminProductApi.getPaging(this.pagingRequest)
							.then((res) => {
								if (res.data.isSuccessful) {
									const data = res.data.data[0].items;
									const totalCount = res.data.data[0].totalRecord;
									return {
										data,
										totalCount,
									};
								} else {
									// toast
									return {
										data: [],
										totalItem: 0,
									};
								}
							})
							.catch((err) => {
								console.log(err);
							});
					},
					remove: (key) => {},
				}),
			}),
			gridColumns: [
				{ caption: "", cellTemplate: "productImage", width: 160 },
				{ caption: "Tên sản phẩm", dataType: "string", dataField: "name", minWidth: 300 },
				{ caption: "Giá (vnd)", dataType: "number", dataField: "price", width: 200 },
			],
		};
	},
	props: {},
	computed: {},
	methods: {
		log(data) {
			console.log(data);
		},
		handleDataRowClicked(data) {
			const id = data.data.id;
			this.$router.push({
				name: RouteNameEnum.AdminProductDetail,
				params: {
					id: id,
				},
			});
		},
		handleAddNewButtonClicked() {
			const id = 0;
			this.$router.push({
				name: RouteNameEnum.AdminProductDetail,
				params: {
					id: id,
				},
			});
		},
	},
};
</script>

<style scoped lang="scss">
#adminProductList {
}

.action-buttons {
	display: flex;
	gap: 16px;
}
.action-button {
	width: 40px;
	height: 40px;
	background: #333;
	cursor: pointer;
}
</style>
