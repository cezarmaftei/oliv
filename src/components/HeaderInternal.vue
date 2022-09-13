<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import CartContent from "@/components/partials/CartContent.vue";
import MainNav from "@/components/menu/MainNav.vue";

const store = useOlivStore();
const route = useRoute();
</script>

<template>
  <header
    class="menu-header"
    :class="{ 'sticky-top': route.name === 'product' }"
  >
    <MainNav :isSingle="route.name === 'product'" />
    <MainNav :isClone="true" v-if="route.name !== 'product'" />

    <transition name="cart-drawer">
      <div
        class="cart-drawer"
        v-show="store.showCartDrawer"
        @keyup.esc="store.showCartDrawer = false"
      >
        <div class="cart-drawer-inner p-5">
          <div class="cart-drawer-backdrop"></div>
          <button @click="store.showCartDrawer = false">X</button>
          <h2>Cosul tau</h2>
          <CartContent />
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped lang="scss">
.cart-drawer {
  position: fixed;
  z-index: 2000;
  right: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  background: $gray-100;
}

.cart-drawer-inner {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
}

.cart-drawer-enter-active,
.cart-drawer-leave-active {
  @include transition(all 0.15s cubic-bezier(0, 0.19, 1, 0.73));
  overflow: hidden;
}

.cart-drawer-enter-from,
.cart-drawer-leave-to {
  width: 0;
}

.cart-drawer-enter-to,
.cart-drawer-leave-from {
  width: 100%;
}
</style>
