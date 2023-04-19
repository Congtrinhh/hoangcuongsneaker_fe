/**
 * trả về giá trị với định dạng tiền để hiển thị giá sản phẩm
 * @param {*} value
 */
export function getCurrencyFormat(value = 0) {
	return value.toLocaleString("vi-VN", { style: "currency", currency: "vnd", minimumFractionDigits: 0 });
}
