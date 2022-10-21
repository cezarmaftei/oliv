<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { onMounted, ref } from "vue";
const store = useOlivStore();
const props = defineProps(["fieldFor", "fieldName", "isCheckout"]);

// Set field stuff depending where it's listed
// If is on the account page, v-model values to mapping object
// If is on the checkout, v-model values to cartData object
const fieldVars = ref({});
onMounted(() => {
  const mappingObject =
    props.fieldFor === "shipping"
      ? store.shippingFieldsMapping
      : store.billingFieldsMapping;

  fieldVars.value["placeholder"] = mappingObject[props.fieldName].name;
  if (mappingObject[props.fieldName].required)
    fieldVars.value["placeholder"] += "*";

  fieldVars.value["type"] = mappingObject[props.fieldName].type;

  fieldVars.value["required"] = mappingObject[props.fieldName].required;
});
</script>

<template>
  <div>
    <input
      v-if="isCheckout && fieldFor === 'shipping'"
      :name="fieldName"
      :type="fieldVars.type"
      class="form-control"
      v-model="store.cartData.addresses.shipping[fieldName]"
      :placeholder="fieldVars.placeholder"
      :required="fieldVars.required"
    />

    <input
      v-if="isCheckout && fieldFor === 'billing'"
      :name="fieldName"
      :type="fieldVars.type"
      class="form-control"
      v-model="store.cartData.addresses.billing[fieldName]"
      :placeholder="fieldVars.placeholder"
      :required="fieldVars.required"
    />

    <input
      v-if="!isCheckout && fieldFor === 'shipping'"
      :name="fieldName"
      :type="fieldVars.type"
      class="form-control"
      v-model="store.shippingFieldsMapping[fieldName].value"
      :placeholder="fieldVars.placeholder"
      :required="fieldVars.required"
    />

    <input
      v-if="!isCheckout && fieldFor === 'billing'"
      :name="fieldName"
      :type="fieldVars.type"
      class="form-control"
      v-model="store.billingFieldsMapping[fieldName].value"
      :placeholder="fieldVars.placeholder"
      :required="fieldVars.required"
    />
  </div>
</template>
