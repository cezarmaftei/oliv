<script setup>
import { useRoute } from "vue-router";
import CartDrawer from "@/components/cart/CartDrawer.vue";

import MainNav from "@/components/menu/MainNav.vue";
const route = useRoute();
</script>

<template>
  <header class="menu-header sticky-top">
    <MainNav :isSingle="route.name === 'product'" />
    <CartDrawer v-if="route.params.slug !== 'finalizare'" />
  </header>
</template>

<style scoped lang="scss">
.sticky-top {
  z-index: 1030;
}
</style>
