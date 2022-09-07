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
  const searchPool = store.storeData.products.concat(
    store.pageData,
    store.articleData
  );
  const results = new Fuse(searchPool, searchOptions).search(
    store.searchData.searchString
  );

  const productResults = results.filter((result) => result.item.name);
  const pageResults = results.filter((result) => result.item.type === "page");
  const articleResults = results.filter(
    (result) => result.item.type === "post"
  );

  return {
    productResults,
    pageResults,
    articleResults,
  };
});
</script>

<template>
  <transition name="search-results">
    <section
      v-if="store.searchData.searchString.length"
      class="section-search-results overflow-auto"
      @keyup.esc="store.searchData.searchString = ''"
    >
      <div class="search-results p-5">
        <button @click="store.searchData.searchString = ''">X</button>
        <FormSearch :isMain="true" />

        <div v-if="searchResults.productResults.length">
          <h4 class="text-white">Produse</h4>

          <div
            v-for="(item, index) in searchResults.productResults"
            :key="item"
          >
            <ProductListing :product="item.item" :productCount="index" />
          </div>
        </div>

        <div v-if="searchResults.articleResults.length">
          <h4 class="text-white">Articole</h4>

          <div
            v-for="(item, index) in searchResults.articleResults"
            :key="item"
          >
            <h3 class="text-white" v-html="item.item.title.rendered"></h3>
          </div>
        </div>

        <div v-if="searchResults.pageResults.length">
          <h4 class="text-white">Pagini</h4>

          <div v-for="(item, index) in searchResults.pageResults" :key="item">
            <h3 class="text-white" v-html="item.item.title.rendered"></h3>
          </div>
        </div>
      </div>
    </section>
  </transition>
</template>

<style scoped lang="scss">
.section-search-results {
  position: fixed;
  height: 100vh;
  z-index: 1100;
  left: 0;
  top: 0;
  width: 100%;
  background: $orange-400;
}

.search-results-enter-active,
.search-results-leave-active {
  @include transition($transition-base);
}

.search-results-enter-from,
.search-results-leave-to {
  height: 0;
}

.search-results-enter-to,
.search-results-leave-from {
  height: 100vh;
}
</style>
