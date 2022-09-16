<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  isMain: Boolean,
});
</script>

<template>
  <div class="search-wrapper" @submit.prevent>
    <form autocomplete="off">
      <input
        type="search"
        name="q"
        placeholder="cauta"
        v-model="store.searchData.searchString"
        :focus="isMain && store.searchData.searchString.length"
      />
    </form>
  </div>
</template>

<style scoped lang="scss">
.search-wrapper {
  position: relative;
  border: 2px solid $border-color;
  padding: 0 4rem 0 2rem;
  border-radius: 2rem;

  &:after {
    content: "";
    display: block;
    width: 1.6rem;
    height: 100%;
    position: absolute;
    top: 0;
    right: 1rem;
    background-image: escape-svg(
      url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16.71 16.71'><polygon points='0 1.41 13.29 14.71 5.71 14.71 5.71 16.71 16.71 16.71 16.71 5.71 14.71 5.71 14.71 13.29 1.41 0 0 1.41'/></svg>")
    );
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  input {
    background: none;
    border: 0;
    padding: 0;
    height: 4rem;
    font-family: $font-family-lanekcut;
    color: $gray-500;
    font-size: 2.4rem;
    width: 100%;

    &:focus,
    &:focus-visible {
      outline: 0;
    }
  }
}
</style>
