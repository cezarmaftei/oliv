<script setup>
defineProps({
  weight: String,
});
</script>
<template>
  <div class="product-weight">
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
    @include font-size(2.4rem);
  }
}
</style>
