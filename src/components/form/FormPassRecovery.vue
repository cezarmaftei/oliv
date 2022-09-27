<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";

const store = useOlivStore();
const route = useRoute();
</script>

<template>
  <form
    @submit.prevent="
      store.userActions(
        'recovery',
        route.query.login,
        null,
        store.userData.credentials.pass,
        route.query.key
      )
    "
  >
    <input
      class="form-control"
      placeholder="Introdu parola noua"
      type="text"
      autocomplete="new-password"
      v-model.lazy="store.userData.credentials.pass"
    /><br />
    <button class="btn btn-outline-dark reverse" type="submit">
      Seteaza parola noua
    </button>
  </form>

  <div class="error-message" v-if="store.userData.error">
    {{ store.userData.error }}
  </div>
</template>
