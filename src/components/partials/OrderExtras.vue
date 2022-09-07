<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { onBeforeUnmount } from "vue";

const store = useOlivStore();

/**
 * Reset the v-model values if no payment method
 */
onBeforeUnmount(() => {
  if (!store.cartData.paymentMethod) {
    for (const extraValue of Object.entries(store.cartData.orderExtras)) {
      extraValue.active = false;
    }
  }
});
</script>

<template>
  <div>
    <h2>Optiuni extra pentru livrare</h2>
    <div v-for="orderExtra in store.cartData.orderExtras" :key="orderExtra">
      <label>
        <input
          type="checkbox"
          v-model="orderExtra.active"
          :true-value="true"
          :false-value="false"
        />
        {{ orderExtra.title }}
      </label>
    </div>
  </div>
</template>
