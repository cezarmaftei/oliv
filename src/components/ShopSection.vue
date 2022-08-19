<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject, onBeforeUnmount } from "vue";
import ProductListing from "@/components/partials/ProductListing.vue";

const store = useOlivStore();

const showCategories = inject("showCategories");

const filterProduct = (categories) => {
  if (showCategories.value === "all") return true;

  const hasCat = categories.filter((cat) => cat.name === showCategories.value);
  return hasCat.length > 0;
};

onBeforeUnmount(() => {
  store.mergeCartProducts();
});
</script>

<template>
  <div class="container" v-if="store.storeData.products">
    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="(product, productCount) in store.getAllProductsByCategory"
        :key="product"
        v-show="filterProduct(product.categories)"
      >
        <ProductListing :product="product" :productCount="productCount" />
      </div>
    </div>
  </div>
</template>
