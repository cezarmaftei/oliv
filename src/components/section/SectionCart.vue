<script setup>
import CartContent from "@/components/cart/CartContent.vue";
</script>
<template>
  <div class="container">
    <div class="cart-page-inner">
      <CartContent :isOffCanvas="false" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-page-inner {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

@include media-breakpoint-up(md) {
  .cart-page-inner {
    background: $body-bg;
    border: 2px solid $body-color;
    @include padding(4rem);
    margin-top: -2px;
    margin-bottom: -2px;
  }
}

@include media-breakpoint-up(lg) {
  .cart-page-inner {
    @include padding(8rem);
    display: flex;
    align-items: flex-start;
  }
}
</style>
