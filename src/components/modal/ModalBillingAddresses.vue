<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import UserAddress from "../user-account/UserAddress.vue";
import BtnClose from "../button/BtnClose.vue";

const store = useOlivStore();

const billingModal = ref(false);
onMounted(() => {
  billingModal.value = new Modal("#billing-addresses-modal");
});
const closeModal = () => {
  billingModal.value.hide();
};
</script>
<template>
  <div
    class="modal fade"
    id="billing-addresses-modal"
    tabindex="-1"
    aria-labelledby="billing-addresses-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header pb-0 pe-10">
          <h2 id="shipping-addresses-modal-label">
            Alege alta dresa de facturare
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
              .billing"
            :key="address"
          >
            <UserAddress
              @address-changed="closeModal()"
              addressType="billing"
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
