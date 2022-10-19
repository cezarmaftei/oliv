<script setup>
import { onMounted } from "vue";
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();

const props = defineProps({
  productIndex: Number,
});

onMounted(() => {
  setTimeout(() => {
    if (store.cartData.items[props.productIndex])
      store.cartData.items[props.productIndex].errorMsg = false;
  }, 5000);
});
</script>

<template>
  <transition name="height-element-sm">
    <div class="error-message">
      {{ store.cartData.items[productIndex].errorMsg }}
    </div>
  </transition>
</template>
