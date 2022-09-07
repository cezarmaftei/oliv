<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import ModalUserAddress from "@/components/partials/ModalUserAddress.vue";
import UserAddress from "@/components/partials/UserAddress.vue";
import { ref, provide } from "vue";

defineProps({
  isCheckout: Boolean,
});

const store = useOlivStore();

const excludeAddressInModal = ref(false);
provide("excludeAddressInModal", excludeAddressInModal);
</script>
<template>
  <ModalUserAddress :isCheckout="isCheckout" />

  <h2 v-if="!isCheckout">Adresele Mele</h2>

  <!-- USER LOGGED IN -->
  <div v-if="store.userData.loggedIn">
    <!-- No address -->
    <div v-if="!store.cartData.addresses.pool.length">
      <h4>Nu ai nici o adresa!</h4>
    </div>
    <!-- /.No address -->

    <button
      v-if="!isCheckout"
      class="btn btn-primary"
      @click="
        store.showUserAddressForm(
          'Adauga o adresa noua!',
          'Adauga adresa',
          'create'
        )
      "
    >
      adauga adresa
    </button>

    <!-- Delivery Address -->
    <div v-if="store.cartData.addresses.pool.length">
      <h4>Adresa de livrare</h4>
      <div v-if="store.cartData.addresses.shipping">
        <UserAddress
          :isCheckout="isCheckout"
          :address="store.cartData.addresses.shipping"
          :index="store.getAddressIndex(store.cartData.addresses.shipping)"
        />
      </div>

      <div v-else>
        <p>Nu ai nici o adresa de livrare</p>
        <a
          href="#user-addresses"
          v-if="store.getUserExtraAddresses.length && !isCheckout"
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </a>
        <button
          v-if="store.cartData.addresses.pool.length && isCheckout"
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
          store.showUserAddressForm(
            'adauga adresa de livrare',
            'Adauga adresa',
            'create'
          );
          store.addressForm.formData.shipping = true;
          store.addressForm.formData.billing = false;
        "
      >
        adauga adresa de livrare
      </button>
    </div>
    <!-- /.Delivery Address -->

    <!-- BillingAddress -->
    <div v-if="store.cartData.addresses.pool.length">
      <h4>Adresa de facturare</h4>

      <div v-if="store.cartData.addresses.billing">
        <div v-if="store.getSameWithShipping">
          <p>La fel ca adresa de livrare</p>

          <a
            v-if="store.cartData.addresses.pool.length > 1 && !isCheckout"
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
              store.getUserExtraAddresses.length &&
              store.showAddressesModal !== true
            "
          >
            selecteaza alta adresa de facturare
          </button>
        </div>

        <div v-else>
          <UserAddress
            :isCheckout="isCheckout"
            :address="store.cartData.addresses.billing"
            :index="store.getAddressIndex(store.cartData.addresses.billing)"
          />
        </div>
      </div>

      <div v-else>
        <p>Nu ai nici o adresa de facturare</p>
        <a
          href="#user-addresses"
          v-if="store.cartData.addresses.pool.length && !isCheckout"
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </a>

        <button
          v-if="store.cartData.addresses.pool.length && isCheckout"
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
          store.showUserAddressForm(
            'adauga adresa de facturare',
            'Adauga adresa',
            'create'
          );
          store.addressForm.formData.shipping = false;
          store.addressForm.formData.billing = true;
        "
      >
        adauga adresa de facturare
      </button>
    </div>
    <div v-if="store.userData.loggedIn && store.getUserExtraAddresses.length">
      <div v-if="!isCheckout" id="user-addresses" class="py-5">
        <h4>Alte adrese disponibile</h4>
        <div
          v-for="(userAddress, userAddressIndex) in store.cartData.addresses
            .pool"
          :key="userAddress"
        >
          <UserAddress
            :address="userAddress"
            :index="userAddressIndex"
            :isCheckout="isCheckout"
            v-if="!userAddress.shipping && !userAddress.billing"
          />
        </div>
      </div>

      <div
        v-else
        class="checkout-addresses-modal"
        :class="store.showAddressesModal ? 'show' : ''"
      >
        <div class="modal-body">
          <button @click="store.showAddressesModal = false">X</button>
          <div id="user-addresses" v-if="store.userData.loggedIn" class="py-5">
            <h4>Adrese disponibile</h4>
            <div
              v-for="(userAddress, userAddressIndex) in store.cartData.addresses
                .pool"
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

  <!-- GUEST CHECKOUT -->
  <div v-else>
    <h2 v-if="isCheckout">Adresa de livrare</h2>

    <!-- Shipping address -->
    <div v-if="store.cartData.addresses.shipping">
      <UserAddress
        :address="store.cartData.addresses.shipping"
        :isCheckout="isCheckout"
        :index="store.getAddressIndex(store.cartData.addresses.shipping)"
      />
    </div>
    <button
      v-else
      class="btn btn-primary"
      @click="
        store.showUserAddressForm(
          'adauga adresa de livrare',
          'Adauga adresa',
          'create'
        );
        store.addressForm.formData.shipping = true;
      "
    >
      adauga adresa de livrare
    </button>

    <!-- Billing address -->
    <div v-if="store.cartData.addresses.shipping">
      <h2 v-if="isCheckout">Adresa de facturare</h2>
      <div v-if="store.cartData.addresses.shipping.billing">
        <p>La fel ca adresa de livrare</p>
        <button
          class="btn btn-primary"
          @click="
            store.showUserAddressForm(
              'adauga adresa de facturare',
              'Adauga adresa',
              'create'
            );
            store.addressForm.formData.shipping = false;
            store.addressForm.formData.billing = true;
          "
        >
          adauga alta adresa de facturare
        </button>
      </div>
      <div
        v-if="
          store.cartData.addresses.billing &&
          !store.cartData.addresses.billing.shipping
        "
      >
        <UserAddress
          :address="store.cartData.addresses.billing"
          :isCheckout="isCheckout"
          :index="store.getAddressIndex(store.cartData.addresses.billing)"
        />
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
