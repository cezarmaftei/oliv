<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed, ref } from "vue";
import BlogArticle from "../article/ArticleListing.vue";

const store = useOlivStore();

const postsPerPage = 10;
const currentPage = ref(1);

const blogArticles = computed(() => {
  return store.articleData.filter(
    (article, count) => count < currentPage.value * postsPerPage
  );
});
</script>

<template>
  <div class="articles-listing pb-8">
    <TransitionGroup name="scale-element">
      <div class="bg-light" v-for="article in blogArticles" :key="article">
        <BlogArticle :article="article" />
      </div>
    </TransitionGroup>
    <button
      v-if="blogArticles.length < store.articleData.length"
      @click="currentPage++"
      class="btn btn-primary d-block ms-auto me-auto mt-5"
    >
      Incarca Mai Multe Articole
    </button>
  </div>
</template>

<style scoped lang="scss">
.articles-listing {
  border-top: 2px solid $border-color;

  .bg-light {
    &:first-child {
      :deep {
        .article-listing {
          border-top: 0;
        }
      }
    }
  }
}
</style>
