<script setup>
import IconUser from "../icons/IconUser.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import IconLoading from "../icons/IconLoading.vue";

const store = useOlivStore();
const route = useRoute();
</script>

<template>
  <div v-if="store.isLoaded" class="navbar-account d-flex align-items-center">
    <div
      v-if="store.userData.loggedIn || route.name === 'account'"
      class="logged-in"
    >
      <router-link to="/contul-meu"
        ><span class="d-none d-xl-block">Contul Meu</span>
        <IconUser class="d-xl-none"
      /></router-link>
    </div>
    <a
      v-if="!store.userData.loggedIn && route.name !== 'account'"
      class="d-block"
      data-bs-toggle="modal"
      href="#login-modal"
      role="button"
    >
      <span class="d-none d-xl-block">Contul Meu</span>
      <IconUser class="d-xl-none" />
    </a>
  </div>
  <div v-else class="navbar-account d-flex align-items-center">
    <IconLoading />
  </div>
</template>

<style scoped lang="scss">
.navbar-account {
  margin-right: 1rem;

  svg {
    height: 2rem;
    width: auto;
  }
}

@include media-breakpoint-up(xs) {
  .navbar-account {
    svg {
      height: 2.2rem;
    }
  }
}

@include media-breakpoint-up(sm) {
  .navbar-account {
    margin-right: 2rem;
  }
}

@include media-breakpoint-up(lg) {
  .navbar-account {
    margin-left: 0;
    margin-right: 0;
  }

  .cloned {
    .navbar-account {
      margin-right: 3rem;
    }
  }
}

@include media-breakpoint-up(xl) {
  .navbar-account {
    margin-left: 0;

    a {
      color: $body-color;

      &:hover {
        color: $olive;
      }
    }
  }
}
</style>
