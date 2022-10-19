<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import { useRoute } from "vue-router";
import ErrorUserAction from "../error/ErrorUserAction.vue";

const store = useOlivStore();
const route = useRoute();

const formFields = ref({
  password: "",
});

const emits = defineEmits(["passwordRecovered"]);

const recoverPass = async () => {
  await store.userActions(
    "recovery",
    route.query.login,
    null,
    formFields.value.password,
    route.query.key
  );

  emits("passwordRecovered", "Parola ta a fost resetata!");
};
</script>

<template>
  <form @submit.prevent="recoverPass()">
    <ErrorUserAction />

    <div class="mb-2">
      <input
        class="form-control"
        placeholder="Introdu parola noua"
        type="password"
        autocomplete="new-password"
        v-model.lazy="formFields.password"
      />
    </div>

    <button class="btn btn-primary reverse" type="submit">
      Seteaza parola noua
    </button>
  </form>
</template>
