<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>

<template>
  <form
    class="reset-form"
    @submit.prevent="
      store.userActions('reset', null, store.userData.credentials.user, null)
    "
  >
    <div class="mb-2">
      <input
        class="form-control"
        placeholder="Introdu adresa de email"
        type="email"
        id="user-email"
        required
        autocomplete="username"
        v-model.lazy="store.userData.credentials.user"
      />
    </div>
    <button class="btn btn-outline-dark reverse" type="submit">
      Reseteaza parola
    </button>
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
  </form>
</template>
