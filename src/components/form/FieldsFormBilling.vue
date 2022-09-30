<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import FormControl from "./FormControl.vue";

const store = useOlivStore();
defineProps({
  isCheckout: Boolean,
});

// Show copy address details button if there is data to copy
const showCopyShippingDetails = computed(() => {
  const coreFields = store.getMappingFieldsByPriority(
    "core",
    store.shippingFieldsMapping
  );
  for (const fieldName of coreFields) {
    if (store.shippingFieldsMapping[fieldName].value.length > 0) return true;
  }

  return false;
});

const copyShippingDetails = () => {
  for (const [fieldName, shippingFieldData] of Object.entries(
    store.shippingFieldsMapping
  )) {
    if (
      shippingFieldData.value.length > 0 &&
      shippingFieldData.type !== "hidden" &&
      store.billingFieldsMapping[fieldName]
    ) {
      store.billingFieldsMapping[fieldName].value = shippingFieldData.value;
    }
  }
};
</script>
<template>
  <div class="form-group">
    <h3>
      Informatii pentru factura
      <button
        v-show="showCopyShippingDetails && isCheckout"
        @click="copyShippingDetails()"
        class="btn"
        type="button"
      >
        foloseste datele din adresa de livrare
      </button>
    </h3>
    <div class="row g-2">
      <div
        class="col-12 col-sm-6"
        v-for="(fieldData, fieldName) in store.billingFieldsMapping"
        :key="fieldName"
        v-show="fieldData.type !== 'hidden'"
      >
        <FormControl
          fieldFor="billing"
          :isCheckout="isCheckout"
          :fieldName="fieldName"
        />
      </div>
    </div>
  </div>
</template>
