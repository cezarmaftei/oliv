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
  <h3 class="mb-2 text-center d-md-none">Categorii:</h3>
  <div class="row row-categories justify-content-center g-50">
    <div class="col-auto">
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
    <div class="col-auto" v-for="cat in store.storeData.categories" :key="cat">
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
@include media-breakpoint-up(md) {
  .row-categories {
    margin: -2px 0;
    width: 100%;

    [class*="col-"] {
      padding: 0;
      margin: 0;
      flex-grow: 1;

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
}
</style>
