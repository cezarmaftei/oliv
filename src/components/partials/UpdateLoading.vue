<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>
<template>
  <div class="store-update-overlay" v-show="store.storeLiveUpdate"></div>
</template>

<style scoped lang="scss">
.store-update-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  left: 0;
  top: 0;
  background: rgba($white, 0.8);
}
</style>
