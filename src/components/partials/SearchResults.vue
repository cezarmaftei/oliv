<script setup>
import ProductListing from "@/components/product/ProductListing.vue";
import FormSearch from "@/components/form/FormSearch.vue";
import Fuse from "fuse.js";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
const store = useOlivStore();

const searchOptions = {
  minMatchCharLength: 2,
  findAllMatches: true,
  threshold: 0.5,
  distance: 10,
  keys: ["title.rendered", "content.rendered", "name", "description"],
};

const searchResults = computed(() => {
  const searchPool = store.storeData.products;
  const results = new Fuse(searchPool, searchOptions).search(
    store.searchData.searchString
  );

  return results;
  // const searchPool = store.storeData.products.concat(
  //   store.pageData,
  //   store.articleData
  // );

  // const productResults = results.filter((result) => result.item.name);
  // const pageResults = results.filter((result) => result.item.type === "page");
  // const articleResults = results.filter(
  //   (result) => result.item.type === "post"
  // );

  // return {
  //   productResults,
  //   pageResults,
  //   articleResults,
  // };
});
</script>

<template>
  <div class="search-results px-2 px-sm-4 px-md-8">
    <FormSearch />
    <div
      class="row row-products gy-2"
      v-if="store.storeData.products && searchResults.length"
    >
      <TransitionGroup name="scale-element">
        <div
          class="col-12 col-md-6 col-xl-4"
          v-for="(item, index) in searchResults"
          :key="item"
        >
          <ProductListing :product="item.item" :productCount="index" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include media-breakpoint-up(sm) {
  .row-products {
    margin: 0 0 -2px;

    [class*="col"] {
      padding: 0;
      margin: 0;
      border: 2px solid $border-color;
      margin-top: -2px;
    }
  }
}

@include media-breakpoint-up(md) {
  .row-products {
    [class*="col"] {
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
</style>
