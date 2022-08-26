<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import FormUserAddress from "@/components/partials/FormUserAddress.vue";
import UserAddress from "@/components/partials/UserAddress.vue";
import { ref, computed, provide } from "vue";

defineProps({
  isCheckout: Boolean,
});

const store = useOlivStore();

const userAddresses = computed(() => {
  return store.getUserAddresses();
});

const excludeAddressInModal = ref(false);
provide("excludeAddressInModal", excludeAddressInModal);
</script>
<template>
  <h2 v-if="!isCheckout">Adresele Mele</h2>
  <div v-if="store.userData.customerData">
    <FormUserAddress />
    <!-- No address -->
    <div v-if="!userAddresses.length">
      <h4>Nu ai nici o adresa!</h4>
    </div>
    <!-- /.No address -->

    <button
      v-if="!isCheckout"
      class="btn btn-primary"
      @click="store.showUserAddressForm('Adauga o adresa noua!', 'create')"
    >
      adauga adresa
    </button>

    <!-- Delivery Address -->
    <div v-if="userAddresses.length">
      <h4>Adresa de livrare</h4>
      <div v-if="store.getUserAddresses('shipping')">
        <UserAddress
          :isCheckout="isCheckout"
          :address="store.getUserAddresses('shipping')"
          :index="store.getAddressIndex(store.getUserAddresses('shipping'))"
        />
      </div>

      <div v-else>
        <p>Nu ai nici o adresa de livrare</p>
        <a
          href="#user-addresses"
          v-if="store.getUserExtraAddresses && !isCheckout"
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </a>
        <button
          v-if="userAddresses.length && isCheckout"
          @click="
            store.showAddressesModal = true;
            excludeAddressInModal = 'shipping';
          "
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </button>
      </div>

      <button
        class="btn btn-primary"
        @click="
          store.showUserAddressForm('adauga adresa de livrare', 'create');
          store.addressForm.formData.shipping = true;
          store.addressForm.formData.billing = false;
        "
      >
        adauga adresa de livrare
      </button>
    </div>
    <!-- /.Delivery Address -->

    <!-- BillingAddress -->
    <div v-if="userAddresses.length">
      <h4>Adresa de facturare</h4>

      <div v-if="store.getUserAddresses('billing')">
        <div v-if="store.getSameWithShipping">
          <p>La fel ca adresa de livrare</p>

          <a
            v-if="userAddresses.length > 1 && !isCheckout"
            href="#user-addresses"
            class="btn btn-dark"
          >
            selecteaza alta adresa de facturare
          </a>
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
        </div>

        <div v-else>
          <UserAddress
            :isCheckout="isCheckout"
            :address="store.getUserAddresses('billing')"
            :index="store.getAddressIndex(store.getUserAddresses('billing'))"
          />
        </div>
      </div>

      <div v-else>
        <p>Nu ai nici o adresa de facturare</p>
        <a
          href="#user-addresses"
          v-if="userAddresses.length && !isCheckout"
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </a>

        <button
          v-if="userAddresses.length && isCheckout"
          @click="
            store.showAddressesModal = true;
            excludeAddressInModal = 'billing';
          "
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </button>
      </div>

      <button
        class="btn btn-primary"
        @click="
          store.showUserAddressForm('adauga adresa de facturare', 'create');
          store.addressForm.formData.shipping = false;
          store.addressForm.formData.billing = true;
        "
      >
        adauga adresa de facturare
      </button>
    </div>
    <div v-if="store.userData.customerData && store.getUserExtraAddresses">
      <div v-if="!isCheckout" id="user-addresses" class="py-5">
        <h4>Alte adrese disponibile</h4>
        <div
          v-for="(userAddress, userAddressIndex) in userAddresses"
          :key="userAddress"
        >
          <div v-if="!userAddress.shipping && !userAddress.billing">
            <UserAddress
              :address="userAddress"
              :index="userAddressIndex"
              :isCheckout="isCheckout"
            />
          </div>
        </div>
      </div>

      <div
        v-else
        class="checkout-addresses-modal"
        :class="store.showAddressesModal ? 'show' : ''"
      >
        <div class="modal-body">
          <button @click="store.showAddressesModal = false">X</button>
          <div
            id="user-addresses"
            v-if="store.userData.customerData"
            class="py-5"
          >
            <h4>Adrese disponibile</h4>
            <div
              v-for="(userAddress, userAddressIndex) in userAddresses"
              :key="userAddress"
            >
              <div v-if="!userAddress[excludeAddressInModal]">
                <UserAddress
                  :address="userAddress"
                  :index="userAddressIndex"
                  :isCheckout="isCheckout"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
