<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { Loader } from "@googlemaps/js-api-loader";
import { reactive } from "vue";

const store = useOlivStore();

let geocoder = reactive(false);
let distanceMatrix = reactive(false);

const mapsLoader = new Loader({
  apiKey: store.shippingData.shipping_options.exwoofood_gg_api,
});

mapsLoader.load().then((google) => {
  geocoder = new google.maps.Geocoder();
  distanceMatrix = new google.maps.DistanceMatrixService();
});

const submitUserAddress = () => {
  const clientAddress = `${store.addressForm.formData.address_1}, ${store.addressForm.formData.city}`;
  geocoder
    .geocode({
      address: clientAddress,
    })
    .then((response) => {
      if (response.results[0]) {
        if (response.results[0].partial_match) {
          // If is partial match, ask for a more accurate address
          store.userData.addressCreateData.error =
            "Nu reusim sa gasim locatia. Te rugam sa introduci adresa exacta!";
        } else {
          // Address found
          store.userData.addressCreateData.error = false;

          // Get distance matrix
          distanceMatrix
            .getDistanceMatrix({
              origins: [store.shippingData.store_address],
              destinations: [clientAddress],
              travelMode: "DRIVING",
            })
            .then((response) => {
              console.log(response.rows[0].elements[0].distance);
              store.userData.addressCreateData.error = "Stai asa!";

              //debug
              return;

              const action = store.addressForm.action;

              // Check if address already exists when creating new address
              if (action === "create") {
                let addressExists = false;
                const userAddresses = store.getUserAddresses();
                if (userAddresses.length) {
                  // Check if address already exists
                  userAddresses.every((address) => {
                    addressExists = store.compareObjects(
                      store.addressForm.formData,
                      address,
                      ["address_2", "shipping", "billing"] // Ignore these
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
              }

              // Create new address
              store.handleUserAddress();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    })
    .catch(
      () =>
        (store.userData.addressCreateData.error =
          "Nu reusim sa gasim locatia. Te rugam sa introduci adresa exacta!")
    );
};
</script>

<template>
  <!-- <pre>{{ store.shippingData }}</pre> -->
  <div
    class="address-form-modal"
    :class="store.addressForm.show ? 'show' : false"
  >
    <button @click="store.addressForm.show = false">X</button>
    <h4>{{ store.addressForm.title }}</h4>
    <form @submit.prevent="submitUserAddress()">
      <div
        v-if="store.userData.addressCreateData.error"
        v-html="store.userData.addressCreateData.error"
      ></div>
      <div
        v-for="(value, addressField) in store.addressForm.formData"
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
              :type="store.addressForm.addressFieldsMapping[addressField].type"
              :name="addressField"
              :required="
                store.addressForm.addressFieldsMapping[addressField].required
              "
              v-model="store.addressForm.formData[addressField]"
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
    <pre>
    {{ store.addressForm.formData }}
    </pre>
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
  }
}
</style>
