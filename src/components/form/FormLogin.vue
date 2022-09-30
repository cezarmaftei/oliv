<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  isModal: Boolean,
});

const emit = defineEmits(["loginEmit", "cancelledEmit"]);

const logInUser = async () => {
  await store
    .userActions(
      "login",
      store.userData.credentials.user,
      null,
      store.userData.credentials.pass
    )
    .then(() => {
      emit("loginEmit");
    });
};

const cancelledEmitAction = () => {
  emit("cancelledEmit");
};
</script>
<template>
  <form @submit.prevent="logInUser">
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
    <!-- <div class="success-message" v-if="store.userData.loggedIn">
      {{ store.userData.loggedIn }}
    </div> -->
    <div class="error-message" v-if="store.userData.error">
      {{ store.userData.error }}
    </div>

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
  </form>
</template>
