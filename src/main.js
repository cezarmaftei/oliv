import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";

import App from "./App.vue";
import router from "./router";

import CurrentYear from "@/components/partials/CurrentYear.vue";

import "./assets/scss/bootstrap.scss";

import { Offcanvas, Modal } from "bootstrap";

const app = createApp(App);
const head = createHead();

app.component("CurrentYear", CurrentYear);

app.use(createPinia());
app.use(head);
app.use(router);

app.mount("#app");
