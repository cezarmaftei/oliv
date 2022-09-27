<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import ProductListing from "@/components/product/ProductListing.vue";
import { inject } from "vue";

const store = useOlivStore();
const route = useRoute();

const showMenuProductCats = inject("showMenuProductCats");
showMenuProductCats.value = true;

const activeCat = inject("activeCat");
if (route.query.categorie) activeCat.value = route.query.categorie;
</script>

<template>
  <div class="row row-products gy-2" v-if="store.storeData.products">
    <TransitionGroup name="scale-element">
      <div
        class="col-12 col-sm-6 col-xl-4 col-xxl-3"
        v-for="(product, productCount) in store.getProductsByCategory(
          activeCat
        )"
        :key="product"
      >
        <ProductListing :product="product" :productCount="productCount" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
@include media-breakpoint-up(sm) {
  .row-products {
    margin: 0 0 -2px;
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

@include media-breakpoint-up(xl) {
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

@include media-breakpoint-up(xxl) {
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
