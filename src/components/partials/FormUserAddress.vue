<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";

const store = useOlivStore();

const submitUserAddress = () => {
  const clientAddress = `${store.addressForm.formData.address_1}, ${store.addressForm.formData.city}`;
  store.checkUserAddress(clientAddress).then((result) => {
    // If response is float then address exists and is in range
    if (typeof result === "number") {
      store.addressForm.formData.distance = result;

      // Check if address already exists when creating new address
      let addressExists = false;
      const userAddresses = store.getUserAddresses();
      if (userAddresses.length) {
        // Check if address already exists
        userAddresses.every((address) => {
          addressExists = store.compareAddressObjects(
            store.addressForm.formData,
            address
          );

          // return true mandatory in every() loop
          if (addressExists) return false;
          else return true;
        });

        if (addressExists) {
          store.userData.addressCreateData.error =
            "Aceasta adresa exista deja!";
          return;
        }
      }

      // Create/Update address
      store.handleUserAddress();
    } else {
      store.userData.addressCreateData.error = result;
      return;
    }
  });
};
</script>

<template>
  <!-- <pre>{{ store.shippingData }}</pre> -->
  <div
    class="address-form-modal"
    :class="store.addressForm.show ? 'show' : false"
  >
    <div class="modal-body">
      <UpdateLoading />
      <button @click="store.addressForm.show = false">X</button>
      <h4>{{ store.addressForm.title }}</h4>
      <form @submit.prevent="submitUserAddress()">
        <div
          class="bg-danger text-white"
          v-if="store.userData.addressCreateData.error"
          v-html="store.userData.addressCreateData.error"
        ></div>
        <div
          v-for="(value, addressField) in store.addressForm
            .addressFieldsMapping"
          :key="addressField"
        >
          <div
            class="field"
            v-if="store.addressForm.addressFieldsMapping[addressField]"
          >
            <label
              v-if="
                store.addressForm.addressFieldsMapping[addressField].type !==
                'hidden'
              "
              >{{ store.addressForm.addressFieldsMapping[addressField].name
              }}<span
                v-if="
                  store.addressForm.addressFieldsMapping[addressField].required
                "
                >*</span
              >
              <input
                v-if="
                  store.addressForm.addressFieldsMapping[addressField].type ===
                  'checkbox'
                "
                :type="
                  store.addressForm.addressFieldsMapping[addressField].type
                "
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
                ['text', 'tel'].indexOf(
                  store.addressForm.addressFieldsMapping[addressField].type
                ) !== -1
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
          {{ store.addressForm.title }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-form-modal {
  display: none;
  &.show {
    overflow: auto;
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: $white;
    z-index: 2000;
  }
}

.modal-body {
  position: relative;
}
</style>
