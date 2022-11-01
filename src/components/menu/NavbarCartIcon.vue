<script setup>
import IconCart from "../icons/IconCart.vue";
import CartQty from "../cart/CartQty.vue";
import { useOlivStore } from "@/stores/oliv.js";
import IconLoading from "../icons/IconLoading.vue";
import ItemPrice from "../partials/ItemPrice.vue";

const store = useOlivStore();
</script>

<template>
  <button
    v-if="store.isLoaded"
    class="btn navbar-cart p-0 d-flex align-items-center text-center"
    data-bs-toggle="offcanvas"
    data-bs-target="#cart-drawer"
    aria-controls="cart-drawer"
  >
    <span class="cart-icon">
      <IconCart />
      <CartQty class="d-flex align-items-center justify-content-center" />
    </span>

    <span class="navbar-total-price">
      <ItemPrice :price="store.cartData.totalPrice" />
    </span>
  </button>
  <button class="btn navbar-cart" v-else><IconLoading /></button>
</template>

<style scoped lang="scss">
.navbar-cart {
  border: 0;
  padding: 0;

  .cart-icon {
    position: relative;
    padding: 0;
    margin-right: 0.5rem;
  }

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

.navbar-total-price {
  margin-top: 0.2rem;
  font-size: 1.6rem;
}

@include media-breakpoint-up(sm) {
  .navbar-total-price {
    font-size: 2rem;
  }
}

@include media-breakpoint-up(md) {
  .navbar-cart {
    padding: 0;
  }
}

@include media-breakpoint-up(xl) {
  .navbar-total-price {
    font-size: 2.4rem;
  }
}
</style>
