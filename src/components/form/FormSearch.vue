<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  isMain: Boolean,
});
</script>

<template>
  <div class="search-wrapper">
    <input
      type="search"
      name="q"
      placeholder="cauta"
      v-model="store.searchData.searchString"
      :focus="isMain && store.searchData.searchString.length"
    />
  </div>
</template>

<style scoped lang="scss">
.search-wrapper {
  border: 2px solid $border-color;
  padding: 0 2rem;
  border-radius: 2rem;

  input {
    background: none;
    border: 0;
    padding: 0;
    height: 4rem;
    font-family: $font-family-lanekcut;
    color: $gray-500;
    font-size: 2.4rem;

    &:focus,
    &:focus-visible {
      outline: 0;
    }
  }
}
</style>
