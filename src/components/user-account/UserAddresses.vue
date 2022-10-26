<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import UserAddress from "./UserAddress.vue";
import { ref } from "vue";
import FormShippingAddress from "../form/FormShippingAddress.vue";
import FormBillingAddress from "../form/FormBillingAddress.vue";

defineProps({
  isCheckout: Boolean,
});

const store = useOlivStore();

const addNewShipping = ref(false);
const addNewBilling = ref(false);
</script>
<template>
  <h2 class="pb-3 mb-3" v-if="!isCheckout">Adresele Mele</h2>

  <!-- Shipping Addresses -->
  <div class="addresses-header d-md-flex align-items-center">
    <h3 class="mb-0">Adresele de livrare</h3>
    <button
      class="btn btn-primary ms-auto mt-1 mt-md-0"
      @click="addNewShipping = !addNewShipping"
    >
      Adauga adresa de livrare
    </button>
  </div>

  <transition name="height-element">
    <div v-if="addNewShipping">
      <div class="p-3 mb-5 bg-white form-wrapper">
        <FormShippingAddress
          :isEmpty="true"
          @address-added-success="addNewShipping = false"
          @cancel-action="addNewShipping = false"
        />
      </div>
    </div>
  </transition>

  <div class="mb-3">
    <transition-group name="add-remove-element">
      <div
        v-for="(address, addressIndex) in store.userData.customerAddresses
          .shipping"
        :key="address"
      >
        <UserAddress
          addressType="shipping"
          :address="address"
          :addressIndex="addressIndex"
          :isCheckout="isCheckout"
        />
      </div>
    </transition-group>
  </div>
  <transition name="height-element-sm">
    <div v-show="!store.userData.customerAddresses.shipping.length">
      <p>Nu ai nici o adresa de livrare</p>
    </div>
  </transition>

  <!-- /.Shipping Addresses -->

  <!-- Billing Addresses -->
  <div class="addresses-header d-md-flex align-items-center">
    <h3 class="mb-0">Adresele de facturare</h3>
    <button
      class="btn btn-primary ms-auto mt-1 mt-md-0"
      @click="addNewBilling = !addNewBilling"
    >
      Adauga adresa de facturare
    </button>
  </div>

  <transition name="height-element">
    <div v-if="addNewBilling">
      <div class="p-3 mb-5 bg-white form-wrapper">
        <FormBillingAddress
          :isEmpty="true"
          @address-added-success="addNewBilling = false"
          @cancel-action="addNewBilling = false"
        />
      </div>
    </div>
  </transition>

  <transition-group name="add-remove-element">
    <div
      v-for="(address, addressIndex) in store.userData.customerAddresses
        .billing"
      :key="address"
    >
      <UserAddress
        addressType="billing"
        :address="address"
        :addressIndex="addressIndex"
        :isCheckout="isCheckout"
      />
    </div>
  </transition-group>

  <transition name="height-element-sm">
    <div v-show="!store.userData.customerAddresses.billing.length">
      <p>Nu ai nici o adresa de facturare</p>
    </div>
  </transition>
  <!-- /.Billing Addresses -->
</template>

<style scoped lang="scss">
h2 {
  border-bottom: 1px solid $gray-300;
}

h3 {
  color: $gray-500;
}

.addresses-header {
  border-bottom: 1px solid $gray-300;
  @include padding(0 0 3rem 0);
  @include margin-bottom(2rem);
}

.form-wrapper {
  @include global-border;
}
</style>
