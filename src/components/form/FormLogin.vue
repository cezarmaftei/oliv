<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>
<template>
  <form
    @submit.prevent="
      store.userActions(
        'login',
        store.userData.credentials.user,
        null,
        store.userData.credentials.pass
      )
    "
  >
    <input
      type="text"
      required
      autocomplete="username"
      v-model.lazy="store.userData.credentials.user"
    /><br />
    <input
      type="password"
      required
      autocomplete="current-password"
      v-model.lazy="store.userData.credentials.pass"
    /><br />
    <button type="" submit>Log In</button>
    <div class="success-message" v-if="store.userData.loggedIn">
      {{ store.userData.loggedIn }}
    </div>
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
  </form>
  <div v-if="!store.userData.loggedIn">
    <router-link to="/contul-meu?action=reset">Mi-am uitat parola</router-link>
    <router-link to="/contul-meu?action=create">Creeaza cont nou</router-link>
  </div>
</template>
