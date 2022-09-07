<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import ProductListing from "@/components/product/ProductListing.vue";
import { inject } from "vue";

const store = useOlivStore();
const route = useRoute();

const showMenuProductCats = inject("showMenuProductCats");
showMenuProductCats.value = true;

const showProduct = (categories) => {
  if (route.query.categorie === "all" || !route.query.categorie) return true;

  const hasCat = categories.filter((cat) => cat.name === route.query.categorie);
  return hasCat.length > 0;
};
</script>

<template>
  <div class="container" v-if="store.storeData.products">
    <div class="row">
      <div
        class="col-12 col-sm-6 col-md-4 col-lg-3"
        v-for="(product, productCount) in store.getAllProductsByCategory"
        :key="product"
        v-show="showProduct(product.categories)"
      >
        <ProductListing :product="product" :productCount="productCount" />
      </div>
    </div>
  </div>
</template>
