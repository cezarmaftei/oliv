<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import { ref } from "vue";

const store = useOlivStore();

const editForm = ref(false);
const editFormData = computed(() => ({
  first_name: store.userData.firstName,
  last_name: store.userData.lastName,
  email: store.userData.email,
  user_pass: "",
}));

const checkPassClass = ref(false);
const checkPassInput = ref("");
const checkPass = () => {
  if (
    (editFormData.value.user_pass.length || checkPassInput.value.length) &&
    editFormData.value.user_pass.length !== checkPassInput.value.length
  ) {
    checkPassClass.value = "bg-danger";
    return false;
  }

  if (
    checkPassInput.value.length >= editFormData.value.user_pass.length &&
    checkPassInput.value !== editFormData.value.user_pass
  ) {
    checkPassClass.value = "bg-danger";
    return false;
  } else if (
    checkPassInput.value.length > 0 &&
    checkPassInput.value.length === editFormData.value.user_pass.length &&
    checkPassInput.value === editFormData.value.user_pass
  ) {
    checkPassClass.value = "bg-success";
    return true;
  }

  return true;
};
</script>
<template>
  <h2>general</h2>
  <img
    v-if="store.userData.avatarUrl"
    :src="store.userData.avatarUrl"
    :alt="`${store.userData.firstName} ${store.userData.lastName}`"
  />
  <button @click="editForm = !editForm" class="btn btn-success">
    Editeaza
  </button>
  <form
    @submit.prevent="
      if (checkPass()) {
        editForm = false;
        checkPassInput = '';
        checkPassClass = '';
        store.updateUserGeneral(editFormData);
      }
    "
  >
    <label>
      Nume
      <input
        :disabled="!editForm"
        :required="editForm"
        v-model="editFormData.first_name"
      />
    </label>
    <br />
    <label>
      Prenume
      <input
        :disabled="!editForm"
        :required="editForm"
        v-model="editFormData.last_name"
      />
    </label>
    <br />
    <label>
      Email
      <input
        :disabled="!editForm"
        :required="editForm"
        v-model="editFormData.email"
      />
    </label>
    <br />
    <label>
      Introdu parola noua
      <input
        :disabled="!editForm"
        type="password"
        v-model="editFormData.user_pass"
      />
    </label>
    <br />
    <label>
      Confirma parola noua
      <input
        :disabled="!editForm"
        :class="checkPassClass"
        type="password"
        v-model="checkPassInput"
        @keyup="checkPass()"
      />
    </label>
    <br />
    <button v-show="editForm" class="btn btn-success">Salveaza</button>
  </form>
</template>
