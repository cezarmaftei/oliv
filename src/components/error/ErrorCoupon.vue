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
  <transition name="height-element-sm">
    <div class="error-message coupon-error">
      {{ store.cartData.coupon.errorMsg }}
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.coupon-error {
  flex: 0 0 100%;
  margin-top: 1rem;
  margin-bottom: 0;
  text-align: center;
}
</style>
