<script setup>
import HeaderInternal from "@/components/HeaderInternal.vue";
import FooterInternal from "@/components/FooterInternal.vue";
import ProductListing from "@/components/product/ProductListing.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";

const store = useOlivStore();

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

const showMenuProductCats = inject("showMenuProductCats");
showMenuProductCats.value = true;
</script>

<template>
  <HeaderInternal />
  <section
    v-if="store.currentPage"
    class="section-product-single overflow-hidden mb-5"
  >
    <div class="container">
      <ProductListing
        :product="store.currentPage"
        :productCount="0"
        :isSingle="true"
      />
    </div>
  </section>
  <section v-if="store.isLoaded" class="section-related-products">
    <div class="container">
      <div class="row row-products">
        <div
          class="col-12 col-sm-6 col-xl-4 col-xxl-3 mb-2"
          v-for="(product, productCount) in relatedProducts(store.currentPage)"
          :key="product"
        >
          <ProductListing :product="product" :productCount="productCount" />
        </div>
      </div>
    </div>
  </section>
  <FooterInternal />
</template>

<style scoped lang="scss">
@include media-breakpoint-between(xs, sm) {
  .section-product-single {
    padding-top: 2rem;
  }
}

@include media-breakpoint-up(sm) {
  .row-products {
    margin: 0 0 -2px;
    border-top: 2px solid $border-color;

    [class*="col"] {
      padding: 0;
      margin: 0 !important;
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
