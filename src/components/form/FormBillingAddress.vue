<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import FieldsFormBilling from "./FieldsFormBilling.vue";

const store = useOlivStore();
const formErrorMessage = ref(false);
const formSuccess = ref(false);

const emits = defineEmits(["addressAddedSuccess", "cancelAction"]);

const props = defineProps({
  formData: Object,
  addressIndex: Number,
});

let buttonText = "Adauga adresa de facturare";
// Populate form data
if (props.formData) {
  buttonText = "Editeaza adresa de facturare";

  for (const [fieldName, fieldValue] of Object.entries(props.formData)) {
    if (store.billingFieldsMapping[fieldName])
      store.billingFieldsMapping[fieldName]["value"] = fieldValue;
  }
}

const submitUserAddress = async () => {
  const action = props.formData ? "edit" : "add";
  const index = props.addressIndex ? props.addressIndex : false;

  const result = await store
    .handleUserAddress(action, "billing", index)
    .then((result) => result);

  if (result.error) {
    formErrorMessage.value = result.error;
    formSuccess.value = false;
  } else {
    formErrorMessage.value = false;
    formSuccess.value = true;
    emits("addressAddedSuccess");

    setTimeout(() => {
      formSuccess.value = false;
    }, 1000);
  }
};

const cancelAction = () => {
  emits("cancelAction");
};
</script>

<template>
  <form @submit.prevent="submitUserAddress()">
    <transition name="height-element-sm">
      <div
        v-if="formErrorMessage || formSuccess"
        :class="{ 'bg-warning': formErrorMessage, 'bg-success': formSuccess }"
      >
        <p v-if="formErrorMessage">{{ formErrorMessage }}</p>
        <p v-else>Adresa a fost adaugata cu success</p>
      </div>
    </transition>

    <FieldsFormBilling />

    <div class="row g-1 mt-3">
      <div class="col-12 col-md-6 col-lg-auto">
        <button type="submit" class="btn btn-outline-dark">
          {{ buttonText }}
        </button>
      </div>
      <div class="col-12 col-md-6 col-lg-auto ms-auto">
        <button
          type="button"
          class="btn btn-outline-dark"
          @click="cancelAction"
        >
          Renunta
        </button>
      </div>
    </div>
  </form>
</template>
