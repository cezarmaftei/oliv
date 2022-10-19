<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import UserActionMessage from "../info-message/UserActionMessage.vue";
const store = useOlivStore();

defineProps({
  isModal: Boolean,
});

const formFields = ref({
  username: "",
  password: "",
});

const formResult = ref({
  success: false,
  error: false,
});

const emit = defineEmits(["loginSuccess", "loginCancelled"]);

const logInUser = async () => {
  // Reset errors
  formResult.value = {
    success: false,
    error: false,
  };

  const loginResult = await store
    .userActions(
      "login",
      formFields.value.username,
      null,
      formFields.value.password
    )
    .then((data) => data);

  if (loginResult.success) {
    formResult.value.success = "Se incarca datele personale...";
    emit("loginSuccess");
  }

  if (loginResult.error) formResult.value.error = loginResult.error;
};

const loginCancelledAction = () => {
  emit("loginCancelled");
};
</script>
<template>
  <form @submit.prevent="logInUser()" class="position-relative">
    <UserActionMessage
      :success="formResult.success"
      :error="formResult.error"
    />

    <div class="mb-2">
      <input
        class="form-control"
        placeholder="utilizator"
        type="text"
        required
        autocomplete="username"
        v-model.lazy="formFields.username"
      />
    </div>

    <div class="mb-2">
      <input
        class="form-control"
        placeholder="parola"
        type="password"
        required
        autocomplete="current-password"
        v-model.lazy="formFields.password"
      />
    </div>

    <button class="btn btn-primary reverse" type="submit">
      Intra in cont
    </button>

    <div class="d-sm-flex mt-2" v-if="!store.userData.loggedIn">
      <router-link to="/contul-meu?action=reset" @click="loginCancelledAction"
        >Mi-am uitat parola</router-link
      >
      <br class="d-sm-none" />
      <router-link
        to="/contul-meu?action=create"
        class="ms-auto"
        @click="loginCancelledAction"
        >Creeaza cont nou</router-link
      >
    </div>
  </form>
</template>
