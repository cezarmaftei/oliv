<script setup>
import ItemPrice from "@/components/partials/ItemPrice.vue";
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  address: Object,
});
</script>
<template>
  <div class="address-fees mt-2" v-if="address.shipping_distance">
    <div
      v-for="addressDistanceFees in [
        store.addressDistanceFees(address.shipping_distance),
      ]"
      :key="addressDistanceFees"
    >
      <p class="mb-0">
        <small>
          Pentru aceasta adresa comanda minima este de
          <ItemPrice :price="addressDistanceFees.min_amount" /><br />
          Transportul costa <ItemPrice :price="addressDistanceFees.fee" /><br />
          Pentru a beneficia de transport gratuit, comanda minima este de
          <ItemPrice :price="addressDistanceFees.free" />
        </small>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-fees {
  line-height: 1.2;
}
</style>
