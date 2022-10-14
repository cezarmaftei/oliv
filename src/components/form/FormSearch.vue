<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  isMain: Boolean,
});
</script>

<template>
  <div class="search-wrapper mb-3">
    <form autocomplete="off" class="d-flex flex-wrap" @submit.prevent>
      <input
        class="px-2"
        id="search-input"
        type="search"
        name="q"
        placeholder="cauta dupa produs"
        v-model="store.searchData.searchString"
      />
      <button type="submit" class="btn btn-outline-dark reverse">Cauta</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.search-wrapper {
  position: relative;

  input {
    background: $white;
    border: 2px solid $border-color;
    border-bottom: 0;
    font-family: $font-family-lanekcut;
    color: $gray-500;
    font-size: 2.4rem;

    &:focus,
    &:focus-visible {
      outline: 0;
    }
  }

  input,
  .btn {
    flex: 0 0 100%;
    max-width: 100%;
  }

  @include media-breakpoint-up(sm) {
    input {
      border-bottom: 2px solid $border-color;
      border-right: 0;
      flex: 0 0 70%;
      max-width: 70%;
    }

    .btn {
      flex: 0 0 30%;
      max-width: 30%;
    }
  }

  @include media-breakpoint-up(lg) {
    max-width: 500px;
    margin-right: auto;
    margin-left: auto;
  }
}

@include media-breakpoint-up(xl) {
  // .search-wrapper {
  //   max-width: 225px;
  // }

  // .scrolling {
  //   .search-wrapper {
  //     min-width: 225px;
  //   }
  // }
}
</style>
