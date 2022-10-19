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
    <h3 class="d-flex flex-column flex-xl-row align-items-xl-center">
      Informatii de contact
      <button
        data-bs-toggle="modal"
        data-bs-target="#shipping-addresses-modal"
        v-if="isCheckout && store.userData.customerAddresses.shipping.length"
        type="button"
        class="btn btn-primary reverse mt-2 ms-xl-auto"
      >
        Alege alta adresa de livrare
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
        :class="fieldCount === 0 ? '' : 'col-sm-6 col-md-12 col-lg-6'"
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
  <div :class="{ 'mt-2': !isCheckout }">
    <div class="form-group">
      <transition name="height-element-sm">
        <div
          v-if="
            (store.cartData.deliveryMethod !== 'pickup' && isCheckout) ||
            !isCheckout
          "
        >
          <h3>Detalii Livrare</h3>
          <div class="row g-2">
            <div
              class="col-12 col-sm-6 col-md-12 col-lg-6"
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
          </div>
        </div>
      </transition>
      <div class="col-12 mt-2" v-if="isCheckout">
        <textarea
          class="form-control"
          placeholder="Alte detalii"
          v-model="store.cartData.orderComments"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@include media-breakpoint-up(xl) {
  .btn {
    margin-top: 0 !important;
  }
}
</style>
