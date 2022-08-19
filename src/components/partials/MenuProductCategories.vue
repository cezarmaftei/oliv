<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";

const store = useOlivStore();
const showCategories = inject("showCategories");
</script>
<template>
  <ul>
    <li>
      <button @click="showCategories = 'all'">Toate</button>
    </li>
    <li v-for="cat in store.storeData.categories" :key="cat">
      <button @click="showCategories = cat.name">
        {{ cat.name }}
      </button>
    </li>
  </ul>
</template>
