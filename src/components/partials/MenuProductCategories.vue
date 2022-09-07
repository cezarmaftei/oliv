<script setup>
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();
</script>
<template>
  <ul class="d-flex flex-wrap list-unstyled">
    <li>
      <router-link
        class="btn btn-success"
        :to="{ path: '/meniu', query: { categorie: 'all' } }"
        >Toate</router-link
      >
    </li>
    <li v-for="cat in store.storeData.categories" :key="cat">
      <router-link
        class="btn btn-success"
        :to="{ path: '/meniu', query: { categorie: cat.name } }"
      >
        {{ cat.name }}
      </router-link>
    </li>
  </ul>
</template>
