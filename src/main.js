import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Global components
import MenuSection from "@/components/MenuSection.vue";
app.component("MenuSection", MenuSection);

app.mount("#app");
