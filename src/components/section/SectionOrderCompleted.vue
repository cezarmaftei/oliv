<script setup>
import { useRoute } from "vue-router";
import OrderDetails from "../partials/OrderDetails.vue";
const route = useRoute();
</script>

<template>
  <div class="order-completed p-8 mb-7">
    <!-- <OrderDetails
      v-if="route.params.orderData"
      :order="route.params.orderData"
    /> -->
    <OrderDetails />
  </div>
</template>

<style scoped lang="scss">
.order-completed {
  border: 2px solid $border-color;
}
</style>
