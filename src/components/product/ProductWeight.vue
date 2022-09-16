<script setup>
defineProps({
  product: Object,
});
</script>
<template>
  <div class="product-weight" v-if="product.weight">
    {{ product.weight
    }}<span
      v-if="
        product.categories.filter((cat) => cat.slug === 'bauturi').length > 0
      "
      >ml</span
    ><span v-else>g</span>
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
