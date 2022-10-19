<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
const store = useOlivStore();

const emits = defineEmits(["recoveryEmailSent"]);

const formFields = ref({
  username: "",
});

const sendRecoveryEmail = async () => {
  await store.userActions("reset", null, formFields.value.username, null);
  emits("recoveryEmailSent", "Verifica-ti emailul pentru a reseta parola!");
};
</script>

<template>
  <form class="reset-form" @submit.prevent="sendRecoveryEmail()">
    <div class="mb-2">
      <input
        class="form-control"
        placeholder="Introdu adresa de email"
        type="email"
        id="user-email"
        required
        autocomplete="username"
        v-model.lazy="formFields.username"
      />
    </div>
    <button class="btn btn-primary reverse" type="submit">
      Reseteaza parola
    </button>
  </form>
</template>
