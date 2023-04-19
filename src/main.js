import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { registerGlobalComponents } from "./utils/global/global-components";
import { registerGlobalFunctions } from "./utils/global/global-functions";

import { RouteNameEnum } from "@/enums/route-name-enum";
import { ModelState } from "@/enums/model-state";

import "bootstrap/dist/css/bootstrap.css";
import "devextreme/dist/css/dx.light.css";
import "./assets/main.css";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";

// Font awesome
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(faBars, faXmark);
library.add(faUser);
// Font awesome

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

// register global properties
app.config.globalProperties.$routeNameEnum = RouteNameEnum;
app.config.globalProperties.$modelState = ModelState;

app.use(createPinia());
app.use(router);
app.use(bootstrap);

registerGlobalComponents(app);
// This is a global mixin, it is applied to every vue instance
registerGlobalFunctions(app);

// app.config.errorHandler

app.mount("#app");
