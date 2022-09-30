<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import UserAddress from "../user-account/UserAddress.vue";
const store = useOlivStore();
</script>
<template>
  <div
    class="modal fade"
    id="shipping-addresses-modal"
    tabindex="-1"
    aria-labelledby="shipping-addresses-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="shipping-addresses-modal-label">
            Alege alta dresa de livrare
          </h3>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div
            v-for="(address, addressIndex) in store.userData.customerAddresses
              .shipping"
            :key="address"
          >
            <UserAddress
              addressType="shipping"
              :address="address"
              :addressIndex="addressIndex"
              :isCheckout="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
