<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  isMain: Boolean,
});
</script>

<template>
  <div class="navbar-search">
    <input
      type="search"
      name="q"
      placeholder="search here..."
      v-model="store.searchData.searchString"
      :focus="isMain && store.searchData.searchString.length"
    />
  </div>
</template>
