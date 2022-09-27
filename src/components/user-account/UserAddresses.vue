<script setup>
import { useOlivStore } from "@/stores/oliv.js";
// import ModalUserAddress from "@/components/partials/ModalUserAddress.vue";
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
  <h2 v-if="!isCheckout">Adresele Mele</h2>

  <!-- USER LOGGED IN -->
  <div v-if="store.userData.loggedIn">
    <!-- Shipping Addresses -->
    <h3>
      Adresele de livrare
      <button class="btn btn-primary" @click="addNewShipping = !addNewShipping">
        Adauga adresa de livrare
      </button>
    </h3>

    <transition name="height-element">
      <FormShippingAddress
        v-if="addNewShipping"
        @address-added-success="addNewShipping = false"
      />
    </transition>

    <div v-if="store.cartData.addresses.shipping.length">
      <div
        v-for="(address, addressIndex) in store.cartData.addresses.shipping"
        :key="address"
      >
        <UserAddress
          addressType="shipping"
          :address="address"
          :addressIndex="addressIndex"
          :isCheckout="isCheckout"
        />
      </div>
    </div>
    <div v-else>
      <p>Nu ai nici o adresa de livrare</p>
    </div>
    <!-- /.Shipping Addresses -->

    <!-- Billing Addresses -->
    <h3>
      Adresele de facturare
      <button class="btn btn-primary" @click="addNewBilling = !addNewBilling">
        Adauga adresa de facturare
      </button>
    </h3>

    <transition name="height-element">
      <FormBillingAddress
        v-if="addNewBilling"
        @address-added-success="addNewBilling = false"
      />
    </transition>

    <div v-if="store.cartData.addresses.billing.length">
      <div
        v-for="(address, addressIndex) in store.cartData.addresses.billing"
        :key="address"
      >
        <UserAddress
          addressType="billing"
          :address="address"
          :addressIndex="addressIndex"
          :isCheckout="isCheckout"
        />
      </div>
    </div>
    <div v-else>
      <p>Nu ai nici o adresa de facturare</p>
    </div>
    <!-- /.Billing Addresses -->
  </div>
</template>

<style scoped lang="scss">
.checkout-addresses-modal {
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
    z-index: 1000;
  }
}

.modal-body {
  position: relative;
}
</style>
