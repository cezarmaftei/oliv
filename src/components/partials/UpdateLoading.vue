<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import IconLoading from "../icons/IconLoading.vue";
const store = useOlivStore();
</script>
<template>
  <div
    class="store-update-overlay align-items-center justify-content-center"
    v-show="store.storeLiveUpdate"
  >
    <IconLoading />
  </div>
</template>

<style scoped lang="scss">
.store-update-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10000;
  left: 0;
  top: 0;
  background: rgba($white, 0.8);
  display: flex;
}
</style>
