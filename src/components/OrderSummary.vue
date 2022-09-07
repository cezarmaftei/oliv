<script setup>
import OrderDetails from "@/components/partials/OrderDetails.vue";
// import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";

// const store = useOlivStore();
const route = useRoute();

const order = route.params.orderData
  ? JSON.parse(route.params.orderData)
  : false;
</script>

<template>
  <div class="container">
    <OrderDetails v-if="order" :order="order" />
    <p v-else>
      Nu ai facut nici o comanda!
      <router-link to="/meniu">Vezi meniul</router-link>
    </p>
  </div>
</template>
