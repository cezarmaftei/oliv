<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import ProductListing from "@/components/product/ProductListing.vue";
import { inject, ref } from "vue";

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
    <div class="row row-products gy-2">
      <div
        class="col-12 col-sm-6 col-lg-4 col-xl-3"
        v-for="(product, productCount) in store.getAllProductsByCategory"
        :key="product"
        v-show="showProduct(product.categories)"
      >
        <ProductListing :product="product" :productCount="productCount" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include media-breakpoint-up(sm) {
  .row-products {
    margin: 0;
    border-top: 2px solid $border-color;

    [class*="col"] {
      padding: 0;
      margin: 0;
      border: 2px solid $border-color;
      border-top: 0;

      &:nth-child(2n) {
        border-left: 0;
      }
    }
  }
}

@include media-breakpoint-up(md) {
  .row-products {
    [class*="col"] {
      &:nth-child(2n) {
        border-left: 2px solid $border-color;
      }

      &:nth-child(3n),
      &:nth-child(3n + 2) {
        border-left: 0;
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .row-products {
    [class*="col"] {
      &:nth-child(3n),
      &:nth-child(3n + 2) {
        border-left: 2px solid $border-color;
      }

      &:nth-child(4n),
      &:nth-child(4n + 2),
      &:nth-child(4n + 3) {
        border-left: 0;
      }
    }
  }
}
</style>
