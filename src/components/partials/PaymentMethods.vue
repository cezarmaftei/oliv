<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { onBeforeUnmount } from "vue";

const store = useOlivStore();

/**
 * Reset cart payment method if no shipping address
 */
onBeforeUnmount(() => {
  if (!store.cartData.addresses.shipping) {
    store.cartData.paymentMethod = false;
  }
});
</script>

<template>
  <div>
    <h2>payment methods</h2>
    <div
      v-for="(paymentMethodTitle, paymentMethodId) in store.paymentData.methods"
      :key="paymentMethodId"
    >
      <label>
        <input
          type="radio"
          v-model="store.cartData.paymentMethod"
          :value="paymentMethodId"
        />
        {{ paymentMethodTitle }}
      </label>
    </div>
  </div>
</template>
