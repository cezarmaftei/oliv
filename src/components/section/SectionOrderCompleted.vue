<script setup>
import { useRoute } from "vue-router";
import OrderDetails from "../partials/OrderDetails.vue";
const route = useRoute();
</script>

<template>
  <div class="order-completed p-8 mb-7">
    <div class="order-completed-inner">
      <!-- <OrderDetails
      v-if="route.params.orderData"
      :order="route.params.orderData"
    /> -->
      <OrderDetails />
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-completed {
  border: 2px solid $border-color;
}

@include media-breakpoint-up(sm) {
  .order-completed-inner {
    border: 2px solid $border-color;
    width: 100%;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    @include padding(3rem);
    background: $white;
  }
}
</style>
