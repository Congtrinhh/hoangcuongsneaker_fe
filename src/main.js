import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { registerGlobalComponent } from "./utils/global/global-components";

import "devextreme/dist/css/dx.light.css";
import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

registerGlobalComponent(app);

// app.config.errorHandler

app.mount("#app");

// mobile first when coding body and so on
