<script setup>
import IconSearch from "../icons/IconSearch.vue";
</script>
<template>
  <button
    class="btn-search text-start d-none d-md-block"
    data-bs-toggle="modal"
    data-bs-target="#search-modal"
  >
    Cauta
  </button>
  <button
    class="btn-mobile-search p-0 d-md-none"
    data-bs-toggle="modal"
    data-bs-target="#search-modal"
  >
    <IconSearch />
  </button>
</template>

<style scoped lang="scss">
.btn-search {
  position: relative;
  @include global-border;
  padding: 0.7rem 3rem 0.7rem 1.5rem;
  border-radius: 2rem;
  background: $white;
  font-family: $font-family-lanekcut;
  color: $gray-500;
  font-size: 2rem;
  line-height: 1.8rem;
  min-width: 16rem;

  &:after {
    content: "";
    display: block;
    width: 1.2rem;
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
}

.btn-mobile-search {
  border: 0;
  background: none;

  svg {
    height: 2rem;
    width: auto;
  }
}

@include media-breakpoint-up(sm) {
  .btn-mobile-search {
    svg {
      height: 2.2rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  .btn-search {
    min-width: 13rem;
    width: 100%;
  }
}

@include media-breakpoint-up(xl) {
  .btn-search {
    min-width: 22rem;
    font-size: 2.4rem;
    padding: 0.7rem 4rem 0.7rem 2rem;
    border-radius: 2.4rem;
    line-height: 1.15;

    &:after {
      width: 1.6rem;
    }
  }
}
</style>
