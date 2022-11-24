<script setup>
import LoadImage from "../partials/LoadImage.vue";
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();

defineProps({
  article: Object,
});
</script>

<template>
  <article class="article-listing">
    <div
      class="article-inner d-flex flex-column flex-md-row align-items-md-center"
    >
      <figure>
        <LoadImage
          class="img-fluid"
          :id="parseInt(article.featured_media)"
          size="medium"
        />
      </figure>
      <div class="article-content d-lg-flex align-items-center flex-grow-1">
        <div class="article-content-left">
          <div class="article-meta">{{ store.articleDate(article) }}</div>
          <h2 class="article-title">
            <router-link :to="store.articleURL(article)">{{
              article.title.rendered
            }}</router-link>
          </h2>
          <div v-html="article.excerpt.rendered"></div>
        </div>
        <div class="article-content-right mt-2 mt-lg-0 ms-lg-auto ps-lg-5">
          <router-link class="btn btn-primary" :to="store.articleURL(article)"
            >Citeste articolul</router-link
          >
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.article-listing {
  @include global-border;
  margin-bottom: -2px;
  @include padding(4rem);

  :deep {
    p {
      margin: 0;
    }
  }

  @include media-breakpoint-up(md) {
    figure {
      @include margin-right(4rem);
      flex: 0 0 22rem;
      max-width: 22rem;
    }
  }
}

.article-meta {
  font-family: $font-family-lanekcut;
  font-size: 2.4rem;
  color: $gray-500;
  line-height: 0.8;
  margin: 1rem 0;

  @include media-breakpoint-up(md) {
    margin-top: 0;
  }
}

.article-title {
  a {
    color: $body-color;

    &:hover {
      color: $olive;
    }
  }
}
</style>
