<script setup>
import { useRoute } from "vue-router";
import OrderDetails from "../partials/OrderDetails.vue";
const route = useRoute();
</script>

<template>
  <div v-if="route.params.orderData" class="order-completed-inner">
    <OrderDetails :order="route.params.orderData" />
  </div>

  <h2 v-else>Nu ai plasat nici o comanda!</h2>
</template>

<style scoped lang="scss">
.order-completed {
  @include global-border;
}

@include media-breakpoint-up(sm) {
  .order-completed-inner {
    @include global-border;
    width: 100%;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    @include padding(3rem);
    background: $white;
  }
}
</style>
