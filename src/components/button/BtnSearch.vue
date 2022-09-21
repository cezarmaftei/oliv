<template>
  <button
    class="btn-search text-start"
    data-bs-toggle="modal"
    data-bs-target="#search-modal"
  >
    Cauta <span>Ctrl + K</span>
  </button>
</template>

<style scoped lang="scss">
.btn-search {
  position: relative;
  border: 2px solid $border-color;
  padding: 0.7rem 4rem 0.7rem 2rem;
  border-radius: 2rem;
  background: $white;
  font-family: $font-family-lanekcut;
  color: $gray-500;
  font-size: 2.4rem;
  line-height: 1.8rem;
  min-width: 23rem;

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

  span {
    display: inline-block;
    vertical-align: middle;
    background: $gray-200;
    font-size: 60%;
    padding: 0.5rem 1rem;
    margin-left: 1rem;
    color: $body-color;
  }
}
</style>
