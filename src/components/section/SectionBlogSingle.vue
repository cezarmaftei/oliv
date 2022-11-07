<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import ArticleSingle from "../article/ArticleSingle.vue";
import ArticleListing from "../article/ArticleListing.vue";
import LogoOliv from "../icons/LogoOliv.vue";

const props = defineProps(["slug"]);

const store = useOlivStore();

const currentArticle = () => {
  return store.articleData.filter((article) => article.slug === props.slug)[0];
};

const relatedArticles = computed(() => {
  return store.articleData.filter(
    (article) => article.id !== currentArticle().id
  );
});
</script>

<template>
  <div class="single-article-wrapper bg-light p-7">
    <ArticleSingle :article="currentArticle()" />

    <div class="article-author p-3 d-flex flex-wrap">
      <figure class="d-flex align-items-center justify-content-center">
        <LogoOliv />
      </figure>
      <div class="author-details">
        <h5>Autor</h5>

        <h3>Oliv Bistro</h3>

        <p class="mb-0">
          &hellip;un mozaic de ganduri, idei și trăiri culese cu grija din
          fiecare loc “cu suflet” prin care bucătăria noastră a poposit.
        </p>
      </div>
    </div>
  </div>

  <div class="related-articles bg-light">
    <h2 class="mb-0 pt-4 px-4">Mai multe pe blogul Oliv:</h2>

    <ArticleListing
      v-for="article in relatedArticles"
      :key="article"
      :article="article"
    />
  </div>
</template>

<style scoped lang="scss">
.single-article-wrapper {
  @include global-border;
  height: 100%;
  flex-grow: 1;

  @include media-breakpoint-up(sm) {
    border-bottom: 0;
  }
}
.related-articles {
  h2 {
    @include global-border;
    border-bottom: 0;
    border-top: 0;

    @include media-breakpoint-up(sm) {
      border-top: 2px solid $border-color;
    }
  }
}

.article-author {
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  @include global-border;

  h5 {
    color: $gray-500;
  }

  figure {
    flex: 0 0 12rem;
    max-width: 12rem;
    height: 12rem;
    background: $gray-500;
    border-radius: 50%;
    margin-left: auto;
    margin-right: auto;

    :deep {
      svg {
        width: 70%;
        height: auto;
        transform: translate(5%, -10%);
      }
    }
  }

  .author-details {
    flex: 0 0 100%;
    max-width: 100%;
    @include margin-top(3rem);
  }

  @include media-breakpoint-up(sm) {
    figure {
      margin-right: 3rem;
      margin-left: 0;
    }
    .author-details {
      flex: 0 0 auto;
      max-width: calc(100% - 15rem);
    }
  }
}
</style>
