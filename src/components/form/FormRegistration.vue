<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
</script>

<template>
  <form class="registration-form" @submit.prevent="store.registerCustomer()">
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>
    <div class="mb-2">
      <input
        placeholder="Introdu adresa de email"
        class="form-control"
        type="email"
        id="user-email"
        required
        autocomplete="username"
        v-model.lazy="store.userData.credentials.user"
      />
    </div>
    <div class="mb-2">
      <input
        placeholder="Introdu parola dorita"
        class="form-control"
        type="password"
        id="user-password"
        required
        autocomplete="new-password"
        v-model.lazy="store.userData.credentials.pass"
      />
    </div>

    <button class="btn btn-outline-dark reverse" type="submit">
      Creaza cont
    </button>
  </form>
</template>

<style scoped lang="scss">
.registration-form {
  position: relative;
}
</style>
