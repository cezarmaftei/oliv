<script setup>
import { useOlivStore } from "@/stores/oliv.js";

const store = useOlivStore();

/**
 * Send user address to Woo or to cookies if user is not logged in
 */
const submitUserAddress = () => {
  let formErrorMessage = "";

  // Check all required fields
  for (const [fieldName, fieldValue] of Object.entries(
    store.addressForm.formData
  )) {
    if (
      store.addressForm.addressFieldsMapping[fieldName].required &&
      !fieldValue.length
    )
      formErrorMessage += `Campul "${store.addressForm.addressFieldsMapping[fieldName].name}" este obligatoriu!<br />`;
  }

  // Return if form errors
  if (formErrorMessage.length) {
    store.addressForm.addressCeateError = formErrorMessage;
    return;
  }

  // Check if address already exists when creating new address
  let addressExists = false;
  if (store.cartData.addresses.pool.length) {
    // Check if address already exists
    store.cartData.addresses.pool.every((address) => {
      addressExists = store.compareAddressObjects(
        store.addressForm.formData,
        address
      );

      // return true mandatory in every() loop
      if (addressExists) return false;
      else return true;
    });

    if (addressExists) {
      store.addressForm.addressCeateError = "Aceasta adresa exista deja!";
      return;
    }
  }

  // Create/Update address
  store.handleUserAddress();
};

/**
 * Reset formData
 */
// const formAction = store.addressForm.action
//   ? store.addressForm.action
//   : "create";

// if (store.addressForm.formData === false || formAction === "create") {
//   store.addressForm.action = "create";
//   store.addressForm.buttonText = "Adauga adresa";

//   store.resetAddressForm();
// }
</script>

<template>
  <form @submit.prevent="submitUserAddress()">
    <div
      class="bg-danger text-white"
      v-if="store.addressForm.addressCeateError"
      v-html="store.addressForm.addressCeateError"
    ></div>
    <div
      v-for="(value, addressField) in store.addressForm.addressFieldsMapping"
      :key="addressField"
    >
      <div
        class="field"
        v-if="store.addressForm.addressFieldsMapping[addressField]"
      >
        <label
          v-show="
            store.addressForm.addressFieldsMapping[addressField].type !==
            'checkbox'
          "
          v-if="
            store.addressForm.addressFieldsMapping[addressField].type !==
            'hidden'
          "
          >{{ store.addressForm.addressFieldsMapping[addressField].name
          }}<span
            v-if="store.addressForm.addressFieldsMapping[addressField].required"
            >*</span
          >
          <input
            v-if="
              store.addressForm.addressFieldsMapping[addressField].type ===
              'checkbox'
            "
            :type="store.addressForm.addressFieldsMapping[addressField].type"
            :name="addressField"
            :required="
              store.addressForm.addressFieldsMapping[addressField].required
            "
            v-model="store.addressForm.formData[addressField]"
            true-value="true"
            false-value="false"
          />
        </label>
        <input
          v-if="
            ['text', 'tel'].includes(
              store.addressForm.addressFieldsMapping[addressField].type
            )
          "
          :type="store.addressForm.addressFieldsMapping[addressField].type"
          :name="addressField"
          :required="
            store.addressForm.addressFieldsMapping[addressField].required
          "
          v-model="store.addressForm.formData[addressField]"
        />

        <textarea
          v-if="
            store.addressForm.addressFieldsMapping[addressField].type ===
            'textarea'
          "
          :name="addressField"
          :required="
            store.addressForm.addressFieldsMapping[addressField].required
          "
          v-model="store.addressForm.formData[addressField]"
        >
        </textarea>
      </div>
    </div>

    <button type="submit" class="btn btn-secondary">
      {{ store.addressForm.buttonText }}
    </button>
  </form>
</template>
