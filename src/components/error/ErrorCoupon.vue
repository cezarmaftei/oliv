<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { onMounted } from "vue";

const store = useOlivStore();
onMounted(() => {
  setTimeout(() => {
    store.cartData.coupon.errorMsg = false;
  }, 5000);
});
</script>
<template>
  <div class="coupon-error">{{ store.cartData.coupon.errorMsg }}</div>
</template>

<style lang="scss" scoped>
.coupon-error {
  flex: 0 0 100%;
  color: $red;
  padding-left: 1rem;
}
</style>
