<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import FormControl from "./FormControl.vue";

const store = useOlivStore();
const props = defineProps({
  isCheckout: Boolean,
});

/**
 * Get shipping price on keyup
 */
const addressError = ref(false);
let timeout = null;
const getShippingPrice = () => {
  if (props.isCheckout) {
    clearTimeout(timeout);

    addressError.value = false;

    timeout = setTimeout(async () => {
      const address = store.cartData.addresses.shipping.shipping_address_1;
      const city = store.cartData.addresses.shipping.shipping_city;
      let newAddressDistance = false;

      if (address.length > 0 && city.length > 0) {
        newAddressDistance = await store
          .addressDistance(
            `${store.cartData.addresses.shipping.shipping_address_1}, ${store.cartData.addresses.shipping.shipping_city}, Romania`
          )
          .then((data) => data);

        if (typeof newAddressDistance === "string") {
          addressError.value = newAddressDistance;
        }
      }

      store.$patch((state) => {
        state.cartData.addresses.shipping.shipping_distance =
          newAddressDistance;
      });
    }, 1000);
  }
};
</script>
<template>
  <!-- Contact details -->
  <div class="form-group">
    <h3>
      Informatii de contact
      <button
        data-bs-toggle="modal"
        data-bs-target="#shipping-addresses-modal"
        v-if="isCheckout && store.cartData.addresses.shipping.length"
        type="button"
        class="btn btn-outline-dark reverse"
      >
        Alege alta adresa delivrare
      </button>
    </h3>
    <div class="row g-2">
      <div
        class="col-12"
        v-for="(fieldName, fieldCount) in store.getMappingFieldsByPriority(
          'core',
          store.shippingFieldsMapping
        )"
        :key="fieldName"
        :class="fieldCount === 0 ? '' : 'col-sm-6'"
      >
        <FormControl
          fieldFor="shipping"
          :fieldName="fieldName"
          :isCheckout="isCheckout"
        />
      </div>
    </div>
  </div>

  <!-- Delivery address -->
  <transition name="height-element">
    <div
      v-if="
        (store.cartData.deliveryMethod !== 'pickup' && isCheckout) ||
        !isCheckout
      "
    >
      <div class="form-group">
        <h3>Detalii Livrare</h3>
        <div class="row g-2">
          <div
            class="col-12 col-sm-6"
            v-for="fieldName in store.getMappingFieldsByPriority(
              'regular',
              store.shippingFieldsMapping
            )"
            :key="fieldName"
            v-show="store.shippingFieldsMapping[fieldName].type !== 'hidden'"
          >
            <FormControl
              fieldFor="shipping"
              :fieldName="fieldName"
              :isCheckout="isCheckout"
              @input="getShippingPrice()"
            />
          </div>

          <transition name="height-element-sm">
            <div class="col-12" v-if="addressError">
              <div class="bg-danger">
                {{ addressError }}
              </div>
            </div>
          </transition>

          <div class="col-12" v-if="isCheckout">
            <textarea
              class="form-control"
              placeholder="Alte detalii"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
