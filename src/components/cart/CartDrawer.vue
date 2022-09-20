<script setup>
import CartHeader from "@/components/cart/CartHeader.vue";
import CartContent from "@/components/cart/CartContent.vue";
</script>
<template>
  <div
    class="offcanvas offcanvas-end cart-drawer"
    tabindex="-1"
    id="cart-drawer"
    aria-labelledby="cart-drawer-label"
  >
    <CartHeader :isOffCanvas="true" />
    <div class="offcanvas-body">
      <div class="offcanvas-content d-flex flex-column">
        <CartContent :isOffCanvas="true" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.offcanvas-content {
  height: 100%;
}
</style>
