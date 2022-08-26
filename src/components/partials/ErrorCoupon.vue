<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject, onMounted } from "vue";

const store = useOlivStore();

const couponCode = inject("couponCode");
onMounted(() => {
  setTimeout(() => {
    store.cartData.coupon.error = false;
    couponCode.value.value = "";
  }, 5000);
});

defineProps({
  errorMsg: String,
});
</script>
<template>
  <div class="bg-danger">{{ errorMsg }}</div>
</template>
