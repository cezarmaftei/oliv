<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import UpdateLoading from "../partials/UpdateLoading.vue";
const store = useOlivStore();

defineProps({
  isModal: Boolean,
});

const emit = defineEmits(["loginEmit", "cancelledEmit"]);

const logInUser = async () => {
  store.storeLiveUpdate = true;
  await store
    .userActions(
      "login",
      store.userData.credentials.user,
      null,
      store.userData.credentials.pass
    )
    .then(() => {
      store.storeLiveUpdate = false;
      setTimeout(() => {
        emit("loginEmit");
      }, 500);
    });
};

const cancelledEmitAction = () => {
  emit("cancelledEmit");
};
</script>
<template>
  <form @submit.prevent="logInUser" class="position-relative">
    <div class="success-message" v-if="store.userData.loggedIn">
      Succes! Se incarca datele personale...
    </div>
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>

    <div class="mb-2">
      <input
        class="form-control"
        placeholder="utilizator"
        type="text"
        required
        autocomplete="username"
        v-model.lazy="store.userData.credentials.user"
      />
    </div>

    <div class="mb-2">
      <input
        class="form-control"
        placeholder="parola"
        type="password"
        required
        autocomplete="current-password"
        v-model.lazy="store.userData.credentials.pass"
      /><br />
    </div>

    <button class="btn btn-outline-dark reverse" type="submit">
      Intra in cont
    </button>

    <div class="d-xs-flex mt-2" v-if="!store.userData.loggedIn">
      <router-link to="/contul-meu?action=reset" @click="cancelledEmitAction"
        >Mi-am uitat parola</router-link
      >
      <br class="d-xs-none" />
      <router-link
        to="/contul-meu?action=create"
        class="ms-auto"
        @click="cancelledEmitAction"
        >Creeaza cont nou</router-link
      >
    </div>

    <UpdateLoading />
  </form>
</template>
