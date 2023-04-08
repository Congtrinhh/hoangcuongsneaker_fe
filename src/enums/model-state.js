/**
 * Trạng thái của 1 model gửi lên api
 * để api biết nó đc gửi lên để thêm/sửa/xoá hay không làm gì
 */
export const ModelState = {
	none: 1,
	create: 2,
	update: 3,
	delete: 4,
};
