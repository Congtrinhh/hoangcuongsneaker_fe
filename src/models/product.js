import BaseModel from "./base-model";
class Product extends BaseModel {
	constructor() {
		super();
		this.name = "";
		this.price = 0;
		this.productInventories = [];
		this.images = [];
		this.slug = "";
		this.description = "";
		this.brand = new Brand();
	}
	name;
	price;
	productInventories;
	images;
	slug;
	description;
	brand;
}

class Image {
	productInventoryId;
	content;
	desc;
	createdAt;
	createdBy;
	updatedAt;
	updatedBy;
}

class Brand {
	name;
	desc;
	createdAt;
	createdBy;
	updatedAt;
	updatedBy;
}

export default Product;
