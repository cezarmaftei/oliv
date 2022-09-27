<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import ProductListing from "../product/ProductListing.vue";

const store = useOlivStore();
const route = useRoute();
</script>

<template>
  <section class="container section-product-single overflow-hidden mb-5">
    <ProductListing
      :product="store.getPageBySlug(route)"
      :productCount="0"
      :isSingle="true"
    />
  </section>
</template>

<style scoped lang="scss">
.section-product-single {
  padding: 0;
}

@include media-breakpoint-up(md) {
  .section-product-single {
    border: 2px solid $border-color;
  }
}
</style>
