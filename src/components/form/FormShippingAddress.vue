<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import FieldsFormShipping from "./FieldsFormShipping.vue";
import ErrorAddress from "../error/ErrorAddress.vue";

const store = useOlivStore();
const formErrorMessage = ref(false);
const formSuccess = ref(false);

const emits = defineEmits(["addressAddedSuccess", "cancelAction"]);

const props = defineProps({
  formData: Object,
  isEmpty: Boolean,
  addressIndex: Number,
});

let buttonText = "Adauga adresa de livrare";

// Populate form data
if (props.formData) {
  buttonText = "Editeaza adresa de livrare";

  for (const [fieldName, fieldValue] of Object.entries(props.formData)) {
    if (store.shippingFieldsMapping[fieldName])
      store.shippingFieldsMapping[fieldName]["value"] = fieldValue;
  }
}

if (props.isEmpty) {
  for (const [fieldName, fieldValue] of Object.entries(
    store.shippingFieldsMapping
  )) {
    fieldValue["value"] = "";
  }
}

const cancelAction = () => {
  emits("cancelAction");
};

const submitUserAddress = async () => {
  const action = props.formData ? "edit" : "add";

  const result = await store
    .handleUserAddress(action, "shipping", props.addressIndex)
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
</script>

<template>
  <form @submit.prevent="submitUserAddress()">
    <ErrorAddress :error="formErrorMessage" :success="formSuccess" />

    <FieldsFormShipping />

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
