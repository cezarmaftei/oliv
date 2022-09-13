<script setup>
import { RouterView, useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { MutationType } from "pinia";
import { provide, ref, watch } from "vue";
import SectionSearchResults from "@/components/section/SectionSearchResults.vue";

const route = useRoute();
const store = useOlivStore();
store.initWebsite();

const showMenuProductCats = ref(false);
provide("showMenuProductCats", showMenuProductCats);

const activeCat = ref("Toate");
provide("activeCat", activeCat);

// Update currentPage on load
store.$subscribe((mutation, state) => {
  if (mutation.payload && mutation.payload.isLoaded) {
    store.currentPage = store.getPageBySlug(route);
  }
});

// Update currentPage on page change
watch(
  () => route.params.slug,
  () => {
    store.currentPage = store.getPageBySlug(route);
  }
);
</script>

<template>
  <div class="page d-flex flex-column">
    <SectionSearchResults />
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
}
</style>
