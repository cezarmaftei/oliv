import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import CurrentYear from "@/components/partials/CurrentYear.vue";

import "./assets/scss/bootstrap.scss";

import { Offcanvas, Modal } from "bootstrap";

const app = createApp(App);

app.component("CurrentYear", CurrentYear);

app.use(createPinia());
app.use(router);

app.mount("#app");
