<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>

<template>
  <span class="cart-qty" v-if="store.cartData.totalQty > 0">{{
    store.cartData.totalQty
  }}</span>
</template>

<style scoped lang="scss">
.navbar-cart {
  .cart-qty {
    border-radius: 50%;
    background: $olive;
    color: $white;
    font-size: 1.3rem;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    right: -0.5rem;
    top: -0.75rem;
  }
}

.cart-drawer,
.cart-page-header-title {
  .cart-qty {
    color: $gray-500;

    &:before {
      content: "(";
    }

    &:after {
      content: ")";
    }
  }
}
</style>
