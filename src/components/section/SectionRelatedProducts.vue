<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import ProductListing from "../product/ProductListing.vue";

const store = useOlivStore();
const route = useRoute();

const relatedProducts = (mainProduct) => {
  let relatedProducts = [];
  mainProduct.categories.forEach((productCat) => {
    store.storeData.products.forEach((product) => {
      product.categories.forEach((cat) => {
        const productExists = relatedProducts.filter(
          (relProduct) => relProduct.id === product.id
        );
        if (
          cat.name === productCat.name &&
          !productExists.length &&
          mainProduct.id !== product.id
        ) {
          relatedProducts.push(product);
        }
      });
    });
  });

  return relatedProducts;
};
</script>

<template>
  <section class="container section-related-products">
    <div class="row row-products">
      <div
        class="col-12 col-sm-6 col-xl-4 col-xxl-3 mb-2"
        v-for="(product, productCount) in relatedProducts(
          store.getPageBySlug(route)
        )"
        :key="product"
      >
        <ProductListing :product="product" :productCount="productCount" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-related-products {
  padding: 0;
}

@include media-breakpoint-up(sm) {
  .row-products {
    margin: 0 0 -2px;

    [class*="col"] {
      padding: 0;
      margin: -2px 0 0 !important;
      @include global-border;

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
