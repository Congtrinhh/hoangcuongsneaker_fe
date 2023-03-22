import VSearchBox from "@/components/base/v-search-box/VSearchBox.vue";
import VProduct from "@/components/base/v-product/VProduct.vue";
import VButton from "@/components/base/v-button/VButton.vue";

export function registerGlobalComponent(app) {
	app.component("v-search-box", VSearchBox);
	app.component("v-product", VProduct);
	app.component("v-button", VButton);
}
