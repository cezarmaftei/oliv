<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";
import AddressFees from "@/components/partials/AddressFees.vue";

const store = useOlivStore();
defineProps({
  address: Object,
  index: Number,
  isCheckout: Boolean,
});
const excludeAddressInModal = inject("excludeAddressInModal");
</script>

<template>
  <div class="user-address">
    <div class="user-address-shipping">
      {{ address.first_name }}
      <span v-if="address.last_name"> {{ address.last_name }}</span
      >, {{ address.address_1
      }}<span v-if="address.address_2"> {{ address.address_2 }}</span
      >, {{ address.city }}, <br />{{ address.phone }} <br />

      <!-- Shipping address -->
      <div v-if="address.shipping">
        <AddressFees :address="address" />
        <button
          class="btn btn-secondary"
          @click="store.showUserAddressForm('Editeaza adresa', 'update', index)"
        >
          editeaza
        </button>

        <button
          @click="
            store.showAddressesModal = true;
            excludeAddressInModal = 'shipping';
          "
          v-if="
            isCheckout &&
            store.getUserExtraAddresses &&
            store.showAddressesModal !== true
          "
          class="btn btn-dark"
        >
          selecteaza alta adresa de livrare
        </button>

        <button
          v-if="
            (excludeAddressInModal === 'billing' &&
              store.showAddressesModal === true) ||
            !isCheckout
          "
          class="btn btn-warning"
          @click="
            store.updateUserAddressFor(
              store.getAddressIndex(address),
              'billing'
            )
          "
        >
          seteaza ca adresa de facturare
        </button>

        <button
          class="btn btn-danger"
          @click="store.deleteUserAddress(store.getAddressIndex(address))"
        >
          Sterge
        </button>
      </div>

      <!-- Billing address -->
      <div v-else-if="address.billing">
        <button
          class="btn btn-secondary"
          @click="store.showUserAddressForm('Editeaza adresa', 'update', index)"
        >
          editeaza
        </button>

        <button
          @click="
            store.showAddressesModal = true;
            excludeAddressInModal = 'billing';
          "
          class="btn btn-dark"
          v-if="
            isCheckout &&
            store.getUserExtraAddresses &&
            store.showAddressesModal !== true
          "
        >
          selecteaza alta adresa de facturare
        </button>
        <button
          v-if="
            (excludeAddressInModal === 'shipping' &&
              store.showAddressesModal === true) ||
            !isCheckout
          "
          class="btn btn-success"
          @click="
            store.updateUserAddressFor(
              store.getAddressIndex(address),
              'shipping'
            )
          "
        >
          seteaza ca adresa de livrare
        </button>

        <button
          class="btn btn-danger"
          @click="store.deleteUserAddress(store.getAddressIndex(address))"
        >
          Sterge
        </button>
      </div>
      <div v-else>
        <AddressFees :address="address" />

        <button
          class="btn btn-secondary"
          @click="store.showUserAddressForm('Editeaza adresa', 'update', index)"
        >
          editeaza
        </button>
        <button
          v-if="excludeAddressInModal === 'shipping' || !isCheckout"
          class="btn btn-success"
          @click="store.updateUserAddressFor(index, 'shipping')"
        >
          seteaza ca adresa de livrare
        </button>

        <button
          v-if="excludeAddressInModal === 'billing' || !isCheckout"
          class="btn btn-warning"
          @click="store.updateUserAddressFor(index, 'billing')"
        >
          seteaza ca adresa de facturare
        </button>

        <button class="btn btn-danger" @click="store.deleteUserAddress(index)">
          sterge
        </button>
      </div>
    </div>
  </div>
</template>
