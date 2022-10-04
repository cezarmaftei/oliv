<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useOlivStore();
const activeCat = inject("activeCat");

watch(
  () => route.query,
  () => {
    if (route.query.categorie) {
      window.scrollTo(0, 0);
    }
  }
);
</script>
<template>
  <div
    v-if="store.isLoaded"
    class="row row-categories justify-content-center g-50"
  >
    <div class="col-auto flex-grow-1">
      <router-link
        @click="activeCat = 'Toate'"
        :class="
          (route.query.categorie === 'Toate' || !route.query.categorie) &&
          (route.params.slug === 'meniu' || route.path === '/')
            ? 'active'
            : ''
        "
        class="btn btn-outline-dark"
        :to="{ path: '/', query: { categorie: 'Toate' } }"
        >Toate</router-link
      >
    </div>
    <div
      class="col-auto flex-grow-1"
      v-for="cat in store.storeData.categories"
      :key="cat"
    >
      <router-link
        @click="activeCat = cat.name"
        :class="route.query.categorie === cat.name ? 'active' : ''"
        class="btn btn-outline-dark"
        :to="{ path: '/', query: { categorie: cat.name } }"
      >
        {{ cat.name }}
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar-bot {
  h3 {
    overflow: hidden;
    @include transition($transition-base);
    max-height: 100px;
  }

  .btn-outline-dark {
    width: 100%;
  }
}

.scrolling {
  .navbar-bot {
    h3 {
      max-height: 0;
      margin: 0 !important;
    }

    .btn-outline-dark {
      padding: 0.3rem 0.5rem;
      width: 100%;
    }
  }
}

@include media-breakpoint-up(xs) {
  .scrolling {
    .navbar-bot {
      .btn-outline-dark {
        padding: 0.3rem 0.7rem;
      }
    }
  }
}

@include media-breakpoint-up(sm) {
  .row-categories {
    [class*="col-"] {
      min-width: 20%;
    }
  }

  .scrolling {
    .navbar-bot {
      .btn-outline-dark {
        padding: 0.7rem 1.2rem;
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .row-categories {
    margin: -2px 0;
    width: 100%;

    [class*="col-"] {
      padding: 0;
      margin: 0;
      min-width: 1px;

      &:first-child {
        .btn {
          border-left: 2px solid $border-color;
        }
      }
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border-right: 2px solid $border-color;
      border-left: 0;
    }
  }

  .scrolling {
    .navbar-bot {
      padding: 0;
      .btn-outline-dark {
        padding: 1rem 1.5rem;
        @include font-size(2.4rem);
      }
    }
  }
}
</style>
