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
    if (store.cartData.addresses.shipping[fieldName].length > 0) return true;
  }

  return false;
});

const copyShippingDetails = () => {
  for (const [fieldName, fieldValue] of Object.entries(
    store.cartData.addresses.shipping
  )) {
    const billingFieldName = fieldName.replace("shipping_", "billing_");
    if (
      fieldValue.length > 0 &&
      store.billingFieldsMapping[billingFieldName] &&
      store.billingFieldsMapping[billingFieldName].type !== "hidden"
    ) {
      store.cartData.addresses.billing[billingFieldName] = fieldValue;
    }
  }
};
</script>
<template>
  <div class="form-group">
    <h3 class="d-flex flex-column flex-xl-row align-items-xl-center">
      Detalii factura
      <button
        data-bs-toggle="modal"
        data-bs-target="#billing-addresses-modal"
        v-if="isCheckout && store.userData.customerAddresses.billing.length"
        type="button"
        class="btn btn-outline-dark reverse px-1 px-xl-2 mt-2 mt-xl-0 ms-xl-auto w-100"
      >
        Alege alta adresa de facturare
      </button>
    </h3>

    <button
      v-if="showCopyShippingDetails && isCheckout"
      @click="copyShippingDetails()"
      class="btn btn btn-outline-dark reverse px-1 px-xl-2 mb-2 d-xl-block ms-xl-auto me-xl-auto w-100"
      type="button"
    >
      foloseste datele din adresa de livrare
    </button>

    <div class="row g-2">
      <div
        class="col-12 col-sm-6 col-md-12 col-lg-6"
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

<style scoped lang="scss">
@include media-breakpoint-up(xl) {
  .w-100 {
    width: auto !important;
  }

  .btn {
    margin-top: 0 !important;
  }
}
</style>
