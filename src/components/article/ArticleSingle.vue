<script setup>
import LoadImage from "../partials/LoadImage.vue";
import { useOlivStore } from "@/stores/oliv.js";
import LogoFacebook from "../icons/LogoFacebook.vue";
import LogoTwitter from "../icons/LogoTwitter.vue";

const store = useOlivStore();

defineProps({
  article: Object,
});
</script>

<template>
  <article class="article-single">
    <div class="article-inner">
      <div class="article-top">
        <h2 class="article-title text-center mb-2">
          {{ article.title.rendered }}
        </h2>

        <div class="article-meta d-flex flex-wrap mb-2">
          <div class="article-date">
            {{ store.articleDate(article) }}
          </div>
          <div class="article-share ms-auto">
            <p class="mb-0">
              distribuie
              <a
                rel="nofollow noopener"
                target="_blank"
                :href="`https://www.facebook.com/sharer/sharer.php?u=https://www.olivbistro.ro${store.articleURL(
                  article
                )}`"
                ><LogoFacebook
              /></a>
              <a
                rel="nofollow noopener"
                target="_blank"
                :href="`https://twitter.com/share?url=https://www.olivbistro.ro${store.articleURL(
                  article
                )}`"
                ><LogoTwitter
              /></a>
            </p>
          </div>
        </div>

        <figure class="text-center">
          <LoadImage
            class="img-fluid"
            :id="parseInt(article.featured_media)"
            size="large"
          />
        </figure>
      </div>

      <div class="article-content pt-5">
        <div v-html="article.content.rendered"></div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.article-top {
  width: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}
.article-meta {
  font-family: $font-family-lanekcut;
  font-size: 2.4rem;
  color: $gray-500;
  fill: $gray-500;
  line-height: 0.8;
  margin: 1rem 0;

  @include media-breakpoint-up(md) {
    margin-top: 0;
  }
}

.article-date,
.article-share {
  display: flex;
  flex: 0 0 100%;
  justify-content: center;
  align-items: center;
}

.article-share {
  a {
    vertical-align: middle;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 1px solid $gray-500;
    margin-left: 0.5rem;

    &:hover {
      svg {
        transform: scale(1.1);
        fill: $olive;
      }
    }
  }

  svg {
    height: 1.5rem;
    width: auto;
    @include transition($transition-base);
  }
}

.article-content {
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;

  :deep {
    img {
      @include img-fluid;
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
      &:not(:first-child) {
        @include margin-top(5rem);
      }

      @include margin-bottom(2.5rem);
    }

    figure {
      @include margin-bottom(2.5rem);
    }
  }
}

@include media-breakpoint-up(sm) {
  .article-date,
  .article-share {
    flex: 0 0 50%;
    justify-content: flex-start;
  }

  .article-share {
    justify-content: flex-end;
  }
}
</style>
