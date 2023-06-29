<script setup>
// import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";
// import { useRoute } from "vue-router";
// const store = useOlivStore();
// const route = useRoute();

const showCookieConsent = inject("showCookieConsent");
</script>

<template>
  <div class="section-cookie-consent fixed-bottom text-center bg-light p-2">
    <h4>Acest site foloseste cookies.</h4>
    <p>
      Continuarea navigării în site înseamnă că ești de acord cu
      <a rel="nofollow" href="/politica-privind-cookiurile"
        >Politica de cookies</a
      >
      a site-ului.
    </p>
    <button @click="showCookieConsent = false" class="btn btn-primary">
      Continua
    </button>
  </div>
</template>

<style scoped lang="scss">
.section-cookie-consent {
  @include global-border;

  a {
    color: $orange;

    &:hover {
      color: $body-color;
    }
  }

  .btn-primary {
    padding: 0.8rem 3.5rem;
  }
}
</style>
