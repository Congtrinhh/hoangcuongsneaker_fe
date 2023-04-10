/// <summary>
/// Trạng thái đơn hàng
/// </summary>
export const ShippingStatusEnum = {
	/// đơn hàng chờ tiếp nhận
	pendingAccept: 1,
	// đơn hàng đã được tiếp nhận
	accepted: 2,
	// đang giao
	delivering: 3,
	// đã giao
	delivered: 4,
	// giao không thành công
	deliverFailed: 5,
};
