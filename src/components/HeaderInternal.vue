<script setup>
import { useRoute } from "vue-router";
import CartDrawer from "@/components/cart/CartDrawer.vue";

import MainNav from "@/components/menu/MainNav.vue";
const route = useRoute();
</script>

<template>
  <header
    class="menu-header"
    :class="{ 'sticky-top': route.name === 'product' }"
  >
    <MainNav :isSingle="route.name === 'product'" />
    <MainNav :isClone="true" v-if="route.name !== 'product'" />
    <CartDrawer v-if="route.params.slug !== 'finalizare'" />
  </header>
</template>
