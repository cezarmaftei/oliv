<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import FieldsFormBilling from "./FieldsFormBilling.vue";
import ErrorAddress from "../error/ErrorAddress.vue";

const store = useOlivStore();
const formErrorMessage = ref(false);
const formSuccess = ref(false);
const formElement = ref(false);

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

  const result = await store
    .handleUserAddress(action, "billing", props.addressIndex)
    .then((result) => result);

  if (result.error) {
    formErrorMessage.value = result.error;
    formSuccess.value = false;

    store.scrollToElement(formElement);
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
  <form ref="formElement" @submit.prevent="submitUserAddress()">
    <ErrorAddress :error="formErrorMessage" :success="formSuccess" />

    <FieldsFormBilling />

    <div class="row g-1 mt-3">
      <div class="col-12 col-md-6 col-lg-auto">
        <button type="submit" class="btn btn-primary">
          {{ buttonText }}
        </button>
      </div>
      <div class="col-12 col-md-6 col-lg-auto ms-auto">
        <button type="button" class="btn btn-primary" @click="cancelAction">
          Renunta
        </button>
      </div>
    </div>
  </form>
</template>
