<script setup>
import CartQty from "@/components/cart/CartQty.vue";
import BtnClose from "@/components/button/BtnClose.vue";
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();
defineProps({
  isOffCanvas: Boolean,
  isCheckout: Boolean,
});
</script>

<template>
  <div
    v-if="isOffCanvas"
    class="offcanvas-header flex-column align-items-start p-4"
  >
    <h2 class="offcanvas-title" id="cart-drawer-label">
      Cosul meu <CartQty />
    </h2>
    <BtnClose type="button" data-bs-dismiss="offcanvas" aria-label="Close" />

    <div v-if="store.getCartItems.length" class="d-flex cart-header-legend">
      <div>Produs</div>
      <div class="ms-auto text-end">Pret</div>
    </div>
  </div>
  <div v-else class="cart-page-header">
    <h2 v-if="!isCheckout" class="cart-page-header-title">
      Cosul meu <CartQty />
    </h2>
    <div class="cart-header-legend d-flex">
      <div>Produs</div>
      <div class="d-none d-sm-block">Cantitate</div>
      <div class="ms-auto text-end">Pret</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-header-legend {
  font-family: $font-family-lanekcut;
  font-size: 2rem;
  line-height: 0.8;
  width: 100%;
}

.cart-page-header {
  @include padding-bottom(4rem);
}

@include media-breakpoint-up(xs) {
  .offcanvas-title {
    font-size: 3.2rem;
  }

  .cart-header-legend {
    font-size: 2.6rem;
  }
}

@include media-breakpoint-up(sm) {
  .cart-page-header {
    .cart-header-legend {
      > *:first-child {
        flex: 0 0 11rem;
        max-width: 11rem;
      }
    }

    h2 {
      margin-bottom: 2rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  .cart-page-header {
    @include padding-bottom(2rem);
  }
}
</style>
