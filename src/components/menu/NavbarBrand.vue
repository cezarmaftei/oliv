<template>
  <router-link class="navbar-brand d-block" to="/"></router-link>
</template>

<style scoped lang="scss">
.navbar-brand {
  display: block;
  width: 6rem;

  &:before,
  &:after {
    content: "";
    display: inline-block;
    vertical-align: bottom;
  }

  &:before {
    width: 4rem;
    height: 3.5rem;
    background: $splash-green-bg no-repeat center center / 100% 100%;
  }

  &:after {
    width: 4rem;
    height: 2.2rem;
    margin-left: -2rem;
    margin-bottom: 0.3rem;
    background: $logo-oliv-bg no-repeat center center / 100% 100%;
  }

  @include media-breakpoint-up(sm) {
    width: 13rem;

    &:before {
      width: 8rem;
      height: 7rem;
    }

    &:after {
      width: 8rem;
      height: 4.4rem;
      margin-left: -3rem;
    }

    &.footer-brand {
      margin: -2rem 0 0 -3rem;

      &.invisible {
        margin: -2rem -3rem 0 0;
      }
    }
  }

  @include media-breakpoint-up(md) {
    &:before {
      width: 8rem;
      height: 7rem;
    }

    &:after {
      width: 8rem;
      height: 4.4rem;
      margin-left: -3rem;
    }
  }

  @include media-breakpoint-up(lg) {
    width: 18rem;

    &:before {
      width: 12rem;
      height: 10.7rem;
    }

    &:after {
      width: 12rem;
      height: 6.5rem;
      margin-left: -6rem;
      margin-bottom: 1rem;
    }
  }

  @include media-breakpoint-up(xl) {
    width: 20rem;

    &:before {
      width: 13rem;
      height: 11.2rem;
    }

    &:after {
      width: 13rem;
      height: 7rem;
    }
  }
}

.cloned {
  .navbar-brand {
    @include media-breakpoint-up(lg) {
      width: 20rem;
      margin-top: -5rem;
      margin-left: -6rem;

      &:before {
        width: 13rem;
        height: 11.2rem;
      }

      &:after {
        width: 9rem;
        height: 5rem;
        margin-left: -2rem;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
