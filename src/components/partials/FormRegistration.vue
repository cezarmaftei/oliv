<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>

<template>
  <form
    class="regsitration-form"
    @submit.prevent="
      store.userActions(
        'register',
        null,
        store.userData.credentials.user,
        store.userData.credentials.pass
      )
    "
  >
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
    <label for="user-email">Introdu adresa de email:</label>
    <input
      type="email"
      id="user-email"
      required
      v-model.lazy="store.userData.credentials.user"
    /><br />

    <label for="user-password">Introdu parola dorita:</label>
    <input
      type="password"
      id="user-password"
      required
      v-model.lazy="store.userData.credentials.pass"
    /><br />

    <button type="submit">Creaza cont</button>
  </form>
</template>
