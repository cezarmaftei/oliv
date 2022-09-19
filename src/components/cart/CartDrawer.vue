<script setup>
import CartContent from "@/components/cart/CartContent.vue";
import CartQty from "@/components/cart/CartQty.vue";
import BtnClose from "@/components/button/BtnClose.vue";
</script>
<template>
  <div
    class="offcanvas offcanvas-end cart-drawer"
    tabindex="-1"
    id="cart-drawer"
    aria-labelledby="cart-drawer-label"
  >
    <div class="offcanvas-header p-4">
      <h2 class="offcanvas-title" id="cart-drawer-label">
        Cosul tau <CartQty />
      </h2>
      <BtnClose type="button" data-bs-dismiss="offcanvas" aria-label="Close" />
    </div>
    <div class="offcanvas-body p-4 pt-0">
      <CartContent />
    </div>
  </div>
</template>
