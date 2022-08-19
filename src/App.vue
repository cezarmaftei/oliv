<script setup>
import { RouterView } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();
store.initWebsite();
</script>

<template>
  <div class="page">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
:deep {
  svg,
  img {
    display: block;
    width: 50px;
  }
}
</style>
