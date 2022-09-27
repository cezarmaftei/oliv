<script setup>
import FormShipping from "../form/FormShipping.vue";
import FormBilling from "../form/FormBilling.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";

const store = useOlivStore();

const showBilling = ref(false);
</script>
<template>
  <!-- <pre>{{ store.cartData }}</pre> -->
</template>
