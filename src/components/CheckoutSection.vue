<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import CartContent from "@/components/partials/CartContent.vue";
import UserAddresses from "@/components/partials/UserAddresses.vue";

const store = useOlivStore();

store.paymentGateways();
</script>

<template>
  <div v-if="store.cartData.orderId" class="container">
    <CartContent :isCheckout="true" />
    <UserAddresses :isCheckout="true" />
  </div>
  <div class="container" v-else>
    <p>
      Nu ai nici un produs in cos.
      <router-link to="/meniu">Vezi meniul</router-link>
    </p>
  </div>
</template>
