<script setup>
defineProps({
  weight: String,
});
</script>
<template>
  <div class="product-weight mb-1 mb-sm-0">
    {{ weight }}
  </div>
</template>

<style scoped lang="scss">
.product-weight {
  font-family: $font-family-lanekcut;
  line-height: 0.8;
  font-size: 2rem;
  color: $gray-500;

  @include media-breakpoint-up(sm) {
    font-size: 2.4rem;
  }
}
</style>
