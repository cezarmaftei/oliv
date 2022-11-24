<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import UserActionMessage from "../info-message/UserActionMessage.vue";
const store = useOlivStore();

const emits = defineEmits(["registrationAction"]);

const formFields = ref({
  username: "",
  password: "",
});

const formResult = ref({
  success: false,
  error: false,
});

const registerCustomer = async () => {
  const customerRegistration = await store
    .registerCustomer(formFields.value)
    .then((data) => data);

  if (customerRegistration.error) {
    formResult.value.error = customerRegistration.error;
  } else {
    emits(
      "registrationAction",
      "Contul tau a fost creat! Verifica-ti emailul pentru a activa contul."
    );
  }
};
</script>

<template>
  <form class="registration-form" @submit.prevent="registerCustomer()">
    <UserActionMessage
      :success="formResult.success"
      :error="formResult.error"
    />

    <div class="mb-2">
      <input
        placeholder="Introdu adresa de email"
        class="form-control"
        type="email"
        id="user-email"
        required
        autocomplete="username"
        v-model.lazy="formFields.username"
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
        v-model.lazy="formFields.password"
      />
    </div>

    <button class="btn btn-primary reverse" type="submit">Creaza cont</button>
  </form>
</template>

<style scoped lang="scss">
.registration-form {
  position: relative;
}
</style>
