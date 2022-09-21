<script setup>
import ProductListing from "@/components/product/ProductListing.vue";
import FormSearch from "@/components/form/FormSearch.vue";
import Fuse from "fuse.js";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
const store = useOlivStore();

const searchOptions = {
  minMatchCharLength: 2,
  includeScore: true,
  threshold: 0.2,
  distance: 50,
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
  <div class="search-results p-5">
    <FormSearch />
    <div v-if="store.storeData.products && searchResults.length">
      <div v-for="(item, index) in searchResults" :key="item">
        <ProductListing :product="item.item" :productCount="index" />
      </div>
    </div>
  </div>
</template>
