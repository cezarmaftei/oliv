<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import FieldsFormShipping from "./FieldsFormShipping.vue";

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

    <div class="row mt-3">
      <div class="col-auto">
        <button type="submit" class="btn btn-outline-dark reverse">
          {{ buttonText }}
        </button>
      </div>
      <div class="col-auto">
        <button
          type="button"
          class="btn btn-outline-dark red"
          @click="cancelAction"
        >
          Renunta
        </button>
      </div>
    </div>
  </form>
</template>
