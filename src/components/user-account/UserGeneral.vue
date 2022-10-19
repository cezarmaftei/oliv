<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import { ref } from "vue";

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
  <div class="form-outer-wrapper">
    <h3 class="mb-2">Detalii Generale</h3>
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
        :required="editForm"
        v-model="editFormData.first_name"
      />

      <input
        class="form-control mb-2"
        placeholder="Email"
        :required="editForm"
        v-model="editFormData.email"
      />

      <input
        class="form-control mb-2"
        placeholder="Introdu parola noua"
        type="password"
        v-model="editFormData.password"
        @keyup="checkPass()"
        autocomplete="off"
      />

      <input
        class="form-control mb-2"
        placeholder="Confirma parola noua"
        :class="checkPassClass"
        type="password"
        v-model="checkPassInput"
        @keyup="checkPass()"
        autocomplete="off"
      />

      <button class="btn btn-primary">Salveaza</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.form-outer-wrapper {
  @include media-breakpoint-up(sm) {
    background: $white;
    @include global-border;
    max-width: 40rem;
    padding: 2rem;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }
}
</style>
