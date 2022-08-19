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
    <label for="user-email">Introdu adresa de email:</label><br />
    <input
      type="email"
      id="user-email"
      required
      v-model.lazy="store.userData.credentials.user"
    /><br />
    <button type="submit">Reseteaza parola</button>
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
  </form>
</template>
