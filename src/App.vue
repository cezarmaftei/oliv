<script setup>
import { RouterView } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { MutationType } from "pinia";
import { provide, ref } from "vue";
import ModalSearchResults from "@/components/partials/ModalSearchResults.vue";
import ModalLogin from "@/components/partials/ModalLogin.vue";
import ModalShippingAddresses from "./components/partials/ModalShippingAddresses.vue";

const store = useOlivStore();
store.initWebsite();

const showMenuProductCats = ref(false);
provide("showMenuProductCats", showMenuProductCats);

const activeCat = ref("Toate");
provide("activeCat", activeCat);
</script>

<template>
  <ModalLogin />
  <ModalSearchResults />
  <ModalShippingAddresses />
  <RouterView />
</template>
