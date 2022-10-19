<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import UserAddress from "../user-account/UserAddress.vue";
import { Modal } from "bootstrap";
import { onMounted, ref } from "vue";
import BtnClose from "../button/BtnClose.vue";

const store = useOlivStore();
const shippingModal = ref(false);
onMounted(() => {
  shippingModal.value = new Modal("#shipping-addresses-modal");
});
const closeModal = () => {
  shippingModal.value.hide();
};
</script>
<template>
  <div
    class="modal fade"
    id="shipping-addresses-modal"
    tabindex="-1"
    aria-labelledby="shipping-addresses-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header pb-0 pe-10">
          <h2 id="shipping-addresses-modal-label">
            Alege alta dresa de livrare
          </h2>
          <BtnClose
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div
            v-for="(address, addressIndex) in store.userData.customerAddresses
              .shipping"
            :key="address"
          >
            <UserAddress
              @address-changed="closeModal()"
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
