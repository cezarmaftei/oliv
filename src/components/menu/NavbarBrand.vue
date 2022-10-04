<template>
  <router-link class="navbar-brand d-block" to="/"></router-link>
</template>

<style scoped lang="scss">
.navbar-brand {
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

  &.footer-brand {
    position: relative;
    margin-top: 1rem;

    &:before {
      position: absolute;
      right: 100%;
      bottom: 100%;
      width: 8rem;
      height: 6rem;
      transform: translate(1rem, 4rem);
    }

    &:after {
      position: relative;
      width: 7rem;
      height: 4rem;
      margin-bottom: 1rem;
      margin-left: -1rem;
    }
  }

  @include media-breakpoint-up(sm) {
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
      margin: -1rem 0 0 -3rem;

      &.invisible {
        margin: -1rem -3rem 0 0;
      }

      &:before {
        position: static;
        transform: none;
        width: 8rem;
        height: 7rem;
      }

      &:after {
        width: 8rem;
        height: 4.4rem;
        margin-left: -1.5rem;
        margin-bottom: 0.5rem;
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

    &.footer-brand {
      &:before {
        position: static;
        transform: none;
      }

      &:after {
        margin-left: -1.5rem;
        margin-bottom: 1rem;
      }
    }
  }

  @include media-breakpoint-up(xl) {
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

.scrolling {
  .navbar-brand {
    @include media-breakpoint-up(md) {
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
