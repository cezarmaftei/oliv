<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import ProductListing from "@/components/product/ProductListing.vue";
import { inject, ref } from "vue";

const store = useOlivStore();
const route = useRoute();

const showMenuProductCats = inject("showMenuProductCats");
showMenuProductCats.value = true;

const activeCat = inject("activeCat");
if (route.query.categorie) activeCat.value = route.query.categorie;
// const showProduct = (categories) => {
//   if (route.query.categorie === "all" || !route.query.categorie) return true;

//   const hasCat = categories.filter((cat) => cat.name === route.query.categorie);
//   return hasCat.length > 0;
// };
</script>

<template>
  <div class="container" v-if="store.storeData.products">
    <div class="row row-products gy-2">
      <TransitionGroup name="show-product">
        <div
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
          v-for="(product, productCount) in store.getProductsByCategory(
            activeCat
          )"
          :key="product"
        >
          <ProductListing :product="product" :productCount="productCount" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.show-product-leave-active {
  @include transition(all 0.1s cubic-bezier(0.75, 0.25, 0.13, 0.92));
}

.show-product-enter-active {
  @include transition(all 0.15s 0.1s cubic-bezier(0.75, 0.25, 0.13, 0.92));
}

.show-product-enter-from,
.show-product-leave-to {
  transform: scale(0);
}

.show-product-enter-to,
.show-product-leave-from {
  transform: scale(1);
}

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

@include media-breakpoint-up(lg) {
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

@include media-breakpoint-up(xl) {
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
