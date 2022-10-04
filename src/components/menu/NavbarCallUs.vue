<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import IconPhone from "../icons/IconPhone.vue";
import IconLoading from "../icons/IconLoading.vue";

const store = useOlivStore();
</script>
<template>
  <a
    v-if="store.isLoaded"
    class="navbar-call-us text-end"
    :href="`tel:${store.websiteOptions.global_settings.phone_number}`"
  >
    <span class="d-none d-xs-block">
      Contacteaza-ne
      <span class="phone-number">{{
        store.websiteOptions.global_settings.phone_number
      }}</span>
    </span>
    <IconPhone class="d-xs-none" />
  </a>
  <div v-else class="navbar-call-us text-end">
    <IconLoading />
  </div>
</template>

<style scoped lang="scss">
.navbar-call-us {
  margin-right: 1rem;
  white-space: nowrap;
  line-height: 0.7;
  font-family: $font-family-lanekcut;
  font-size: 1.8rem;
  color: $gray-500;

  .phone-number {
    display: block;
    font-size: 2.3rem;
    color: $body-color;
  }

  svg {
    height: 2rem;
    width: auto;
  }
}

@include media-breakpoint-up(sm) {
  .navbar-call-us {
    margin-right: 2rem;
  }
  .scrolling {
    .navbar-call-us {
      display: flex;
      align-items: center;
      margin: 0;
      margin-right: 3rem;

      .phone-number {
        margin-left: 1.5rem;
      }
    }
  }
}

@include media-breakpoint-between(sm, md) {
  .navbar-call-us {
    font-size: 2.2rem;

    .phone-number {
      font-size: 2.8rem;
    }
  }
}

@include media-breakpoint-up(md) {
  .navbar-call-us {
    font-size: 2.4rem;

    span {
      font-size: 2.4rem;
      display: flex !important;
    }

    .phone-number {
      margin-left: 1rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  .navbar-call-us {
    margin-bottom: 0.5rem;
    margin-right: 0;
    font-size: 2.4rem;

    span {
      display: block !important;
    }

    .phone-number {
      font-size: 3rem;
    }
  }

  .scrolling {
    .navbar-call-us {
      font-size: 2.4rem;

      span {
        display: flex !important;
      }

      .phone-number {
        font-size: 2.4rem;
      }
    }
  }
}

@include media-breakpoint-up(xl) {
  .navbar-call-us {
    display: flex;
    justify-content: flex-end;
    font-size: 2.4rem;
    @include margin-bottom(2rem);

    span {
      display: flex !important;
    }

    .phone-number {
      font-size: 2.4rem;
      margin-left: 1.5rem;
    }
  }
}
</style>
