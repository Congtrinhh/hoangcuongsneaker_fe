import { ToastType } from "@/enums/toast-type";
import notify from "devextreme/ui/notify";
import hideToasts from "devextreme/ui/toast/hide_toasts";
import { ShippingStatusEnum } from "@/enums/shipping-status-enum";

export function registerGlobalFunctions(app) {
	// This is a global mixin, it is applied to every vue instance
	app.mixin({
		methods: {
			//#region Toast thông báo
			$showSuccess(message = "Thành công", additionalToastConfig = {}) {
				notify(
					{
						message: message,
						width: 240,
						type: ToastType.success,
						displayTime: 3500,
						animation: {
							show: {
								type: "fade",
								duration: 400,
								from: 0,
								to: 1,
							},
							hide: { type: "fade", duration: 40, to: 0 },
						},
						...additionalToastConfig,
					},
					{ position: "bottom center", direction: "up-push" }
				);
			},
			$showWarning(message = "Cảnh báo", additionalToastConfig = {}) {
				notify(
					{
						message: message,
						width: 200,
						type: ToastType.warning,
						displayTime: 3500,
						animation: {
							show: {
								type: "fade",
								duration: 400,
								from: 0,
								to: 1,
							},
							hide: { type: "fade", duration: 40, to: 0 },
						},
						...additionalToastConfig,
					},
					{ position: "bottom center", direction: "up-push" }
				);
			},
			$showError(message = "Có lỗi xảy ra", additionalToastConfig = {}) {
				notify(
					{
						message: message,
						width: 200,
						type: ToastType.error,
						displayTime: 3500,
						animation: {
							show: {
								type: "fade",
								duration: 400,
								from: 0,
								to: 1,
							},
							hide: { type: "fade", duration: 40, to: 0 },
						},
						...additionalToastConfig,
					},
					{ position: "bottom center", direction: "up-push" }
				);
			},
			$showInfo(message = "Chú ý", additionalToastConfig = {}) {
				notify(
					{
						message: message,
						width: 200,
						type: ToastType.info,
						displayTime: 3500,
						animation: {
							show: {
								type: "fade",
								duration: 400,
								from: 0,
								to: 1,
							},
							hide: { type: "fade", duration: 40, to: 0 },
						},
						...additionalToastConfig,
					},
					{ position: "bottom center", direction: "up-push" }
				);
			},
			//#endregion

			/**
			 * log dữ liệu (dùng để debug trên template)
			 * @param {} data
			 */
			$log(data) {
				console.log(data);
			},
			/**
			 * tạo mã Guid
			 * @returns
			 */
			$generateUUIDv4() {
				return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
					(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
				);
			},
			/**
			 * lấy ra text hiển thị dựa vào giá trị số của gender
			 * @param {*} gender
			 */
			$getGenderText(gender = 0) {
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
			$getShippingStatusText(shippingStatus = 1) {
				switch (shippingStatus) {
					case ShippingStatusEnum.pendingAccept:
						return "Chờ xác nhận";
					case ShippingStatusEnum.accepted:
						return "Đã xác nhận";
					case ShippingStatusEnum.delivering:
						return "Đang vận chuyển";
					case ShippingStatusEnum.delivered:
						return "Đã giao";
					case ShippingStatusEnum.deliverFailed:
						return "Giao không thành công";
					default:
						return "Không xác định";
				}
			},
		},
	});
}
