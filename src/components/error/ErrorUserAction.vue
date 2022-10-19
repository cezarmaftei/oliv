<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>
<template>
  <transition name="height-element-sm">
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
  </transition>
</template>
