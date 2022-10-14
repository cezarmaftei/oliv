<template>
  <button class="btn-close"></button>
</template>

<style lang="scss" scoped>
.btn-close {
  display: inline-block;
  width: 2.2rem;
  height: 2.2rem;
  background: escape-svg(
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.77 451.77"><path d="M225.89,167.74,393.63,0l58.14,58.71L284.6,225.89,451.77,393.63l-58.14,58.14L225.89,284.6,58.71,451.77,0,393.63,167.74,225.89,0,58.71,58.71,0Z" style="fill-rule:evenodd"/></svg>')
    )
    no-repeat center center / 1.6rem 1.6rem;
  border: 0;

  &:hover {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
}

.cart-drawer .btn-close {
  position: absolute;
  @include rfs(2rem, top);
  @include rfs(2rem, right);
}

.offcanvas-header .btn-close {
  @include rfs(4rem, top);
  @include rfs(4rem, right);
}

.modal-header .btn-close {
  margin: 0;
  padding: 0;
  position: absolute;
  @include rfs(2rem, top);
  @include rfs(2rem, right);
}
</style>
