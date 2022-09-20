<script setup>
import ItemPrice from "@/components/partials/ItemPrice.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
const store = useOlivStore();

const props = defineProps({
  address: Object,
});

const addressDistanceFees = computed(() =>
  store.getDistanceFees(props.address.distance)
);
</script>
<template>
  <div v-if="address.distance && addressDistanceFees">
    Pentru aceasta adresa comanda minima este de
    <ItemPrice :price="addressDistanceFees.min_amount" /><br />
    Transportul costa <ItemPrice :price="addressDistanceFees.fee" /><br />
    Pentru a beneficia de transport gratuit, comanda minima este de
    <ItemPrice :price="addressDistanceFees.free" />
  </div>
  <div v-else>
    <p>
      Ne pare rau, nu putem livra la aceasta adresa pentru ca este prea departe.
    </p>
  </div>
</template>
