<script setup>
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();
defineProps({
  isCheckout: Boolean,
});
</script>
<template>
  <div v-if="isCheckout"></div>
</template>
