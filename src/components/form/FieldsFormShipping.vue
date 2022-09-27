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

    timeout = setTimeout(async () => {
      const shippingData = await store.addressDistanceAndShippingPrice(
        (data) => data
      );
      if (shippingData && shippingData.error) {
        store.cartData.totalShipping = false;
        addressError.value = shippingData.error;
        store.updateCartTotals();
        return;
      }

      if (shippingData) {
        store.$patch((state) => {
          state.cartData.totalShipping = shippingData.fee;
        });
        addressError.value = false;
      }
    }, 1000);
  }
};
</script>
<template>
  <!-- Contact details -->
  <div class="form-group">
    <h3>Informatii de contact</h3>
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
        <FormControl fieldFor="shippingFieldsMapping" :fieldName="fieldName" />
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
              fieldFor="shippingFieldsMapping"
              :fieldName="fieldName"
              @keyup="getShippingPrice()"
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
