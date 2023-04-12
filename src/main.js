import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { registerGlobalComponents } from "./utils/global/global-components";
import { registerGlobalFunctions } from "./utils/global/global-functions";

import { RouteNameEnum } from "@/enums/route-name-enum";
import { ModelState } from "@/enums/model-state";

import "devextreme/dist/css/dx.light.css";
import "./assets/main.css";

const app = createApp(App);

// register global properties
app.config.globalProperties.$routeNameEnum = RouteNameEnum;
app.config.globalProperties.$modelState = ModelState;

app.use(createPinia());
app.use(router);

registerGlobalComponents(app);
// This is a global mixin, it is applied to every vue instance
registerGlobalFunctions(app);

// app.config.errorHandler

app.mount("#app");
