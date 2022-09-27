<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import FieldsFormShipping from "./FieldsFormShipping.vue";

const store = useOlivStore();
const formErrorMessage = ref(false);
const formSuccess = ref(false);

const emits = defineEmits(["addressAddedSuccess"]);

const props = defineProps({
  formData: Object,
  addressIndex: Number,
});

let buttonText = "Adauga adresa de livrare";
// Populate form data
if (props.formData) {
  buttonText = "Editeaza adresa de livrare";

  for (const [fieldName, fieldValue] of Object.entries(props.formData)) {
    const mappingName = fieldName.replace("shipping_", "");

    if (store.shippingFieldsMapping[mappingName])
      store.shippingFieldsMapping[mappingName]["value"] = fieldValue;
  }
}

const submitUserAddress = async () => {
  const action = props.formData ? "edit" : "add";
  const index = props.addressIndex ? props.addressIndex : false;

  const result = await store
    .handleUserAddress(action, "shipping", index)
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
    <transition name="height-element-sm">
      <div
        v-if="formErrorMessage || formSuccess"
        :class="{ 'bg-warning': formErrorMessage, 'bg-success': formSuccess }"
      >
        <p v-if="formErrorMessage">{{ formErrorMessage }}</p>
        <p v-else>Adresa a fost adaugata cu success</p>
      </div>
    </transition>

    <FieldsFormShipping />

    <button type="submit" class="btn btn-outlin-secondary">
      {{ buttonText }}
    </button>
  </form>
</template>
