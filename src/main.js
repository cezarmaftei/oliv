import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/bootstrap.scss";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Global components
import CurrentYear from "@/components/partials/CurrentYear.vue";
app.component("CurrentYear", CurrentYear);

import ShopSection from "@/components/ShopSection.vue";
app.component("ShopSection", ShopSection);

import AccountSection from "@/components/AccountSection.vue";
app.component("AccountSection", AccountSection);

app.mount("#app");
