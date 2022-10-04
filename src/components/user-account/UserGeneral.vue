<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import { ref } from "vue";
import VLazyImage from "v-lazy-image";

const store = useOlivStore();

const editForm = ref(false);
const editFormData = computed(() => ({
  first_name: store.userData.firstName,
  email: store.userData.email,
  password: "",
}));

const checkPassClass = ref(false);
const checkPassInput = ref("");
const checkPass = () => {
  if (
    (editFormData.value.password.length || checkPassInput.value.length) &&
    editFormData.value.password.length !== checkPassInput.value.length
  ) {
    checkPassClass.value = "bg-danger";
    return false;
  }

  if (
    checkPassInput.value.length >= editFormData.value.password.length &&
    checkPassInput.value !== editFormData.value.password
  ) {
    checkPassClass.value = "bg-danger";
    return false;
  } else if (
    checkPassInput.value.length > 0 &&
    checkPassInput.value.length === editFormData.value.password.length &&
    checkPassInput.value === editFormData.value.password
  ) {
    checkPassClass.value = "bg-success";
    return true;
  }

  return true;
};
</script>
<template>
  <div class="p-7">
    <v-lazy-image
      v-if="store.userData.avatarUrl"
      :src="store.userData.avatarUrl"
      :alt="store.userData.firstName"
    />
    <button @click="editForm = !editForm" class="btn btn-outline-dark reverse">
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
      <input
        placeholder="Nume"
        class="form-control mb-2"
        :disabled="!editForm"
        :required="editForm"
        v-model="editFormData.first_name"
      />

      <input
        class="form-control mb-2"
        placeholder="Email"
        :disabled="!editForm"
        :required="editForm"
        v-model="editFormData.email"
      />

      <input
        class="form-control mb-2"
        placeholder="Introdu parola noua"
        :disabled="!editForm"
        type="password"
        v-model="editFormData.password"
        autocomplete="off"
      />

      <input
        class="form-control mb-2"
        placeholder="Confirma parola noua"
        :disabled="!editForm"
        :class="checkPassClass"
        type="password"
        v-model="checkPassInput"
        @keyup="checkPass()"
        autocomplete="off"
      />

      <button v-show="editForm" class="btn btn-outline-dark">Salveaza</button>
    </form>
  </div>
</template>
