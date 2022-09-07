<script setup>
import OrderDetails from "@/components/partials/OrderDetails.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";

const store = useOlivStore();

const getUserOrders = computed(() => {
  if (store.userData.customerOrdersData) {
    return store.userData.customerOrdersData.filter(
      (order) => order.status === "completed"
    );
  }
  return false;
});
</script>
<template>
  <h2>Comenzile Mele</h2>
  <div v-if="store.userData">
    <div v-if="getUserOrders.length">
      <div
        class="user-order p-4 mb-5"
        v-for="order in getUserOrders"
        :key="order"
      >
        <OrderDetails :order="order" />
      </div>
    </div>
    <div v-else>
      Nu ai plasat nici o comanda inca.
      <router-link to="/meniu">Vezi meniul!</router-link>
    </div>
  </div>
  <div v-else>Se incarca...</div>
</template>

<style scoped lang="scss">
.user-order {
  border: 1px solid $black;
}
</style>
