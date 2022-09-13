<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";
const store = useOlivStore();
</script>

<template>
  <form class="registration-form" @submit.prevent="store.registerCustomer()">
    <UpdateLoading />
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
    <label for="user-email">Introdu adresa de email:</label>
    <input
      type="email"
      id="user-email"
      required
      autocomplete="username"
      v-model.lazy="store.userData.credentials.user"
    /><br />

    <label for="user-password">Introdu parola dorita:</label>
    <input
      type="password"
      id="user-password"
      required
      autocomplete="new-password"
      v-model.lazy="store.userData.credentials.pass"
    /><br />

    <button type="submit">Creaza cont</button>
  </form>
</template>

<style scoped lang="scss">
.registration-form {
  position: relative;
}
</style>
