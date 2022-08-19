<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import FormUserAddress from "@/components/partials/FormUserAddress.vue";
import { computed } from "vue";

const store = useOlivStore();

const sameWithShipping = computed(() => {
  return store.compareObjects(
    store.userData.customerData.shipping,
    store.userData.customerData.billing,
    ["address_2", "shipping", "billing"]
  );
});

const userAddresses = computed(() => {
  return store.getUserAddresses();
});

const getAddressIndex = (address) => {
  let result = false;
  userAddresses.value.forEach((userAddress, userAddressIndex) => {
    const addressExists = store.compareObjects(userAddress, address, [
      "address_2",
      "shipping",
      "billing",
    ]);
    if (addressExists) result = userAddressIndex;
  });

  return result;
};
</script>
<template>
  <h2>Adresele Mele</h2>
  <div v-if="store.userData.customerData">
    <FormUserAddress />

    <!-- No address -->
    <div v-if="!userAddresses.length">
      <h4>Nu ai nici o adresa!</h4>
    </div>
    <!-- /.No address -->

    <button
      class="btn btn-primary"
      @click="store.showUserAddressForm('Adauga o adresa noua!', 'create')"
    >
      adauga adresa
    </button>

    <!-- Delivery Address -->
    <div v-if="userAddresses.length">
      <h4>Adresa de livrare</h4>

      <div v-if="store.userData.customerData.shipping.address_1">
        <pre>
          {{ store.userData.customerData.shipping }}
        </pre>
        <button
          class="btn btn-secondary"
          @click="
            store.showUserAddressForm(
              'Editeaza adresa',
              'update',
              getAddressIndex(store.userData.customerData.shipping)
            )
          "
        >
          editeaza
        </button>
        <button class="btn btn-dark">selecteaza alta adresa de livrare</button>
        <button
          class="btn btn-danger"
          @click="
            store.deleteUserAddress(
              getAddressIndex(store.userData.customerData.shipping)
            )
          "
        >
          Sterge
        </button>
      </div>

      <div v-else>
        <p>Nu ai nici o adresa de livrare</p>
        <a
          href="#user-addresses"
          v-if="userAddresses.length"
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </a>
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

      <div v-if="store.userData.customerData.billing.address_1">
        <div v-if="sameWithShipping">
          <p>La fel ca adresa de livrare</p>

          <button class="btn btn-dark">
            selecteaza alta adresa de facturare
          </button>
        </div>

        <div v-else>
          <pre>{{ store.userData.customerData.billing }}</pre>
          <button
            class="btn btn-secondary"
            @click="
              store.showUserAddressForm(
                'Editeaza adresa',
                'update',
                getAddressIndex(store.userData.customerData.billing)
              )
            "
          >
            editeaza
          </button>
          <button class="btn btn-dark">
            selecteaza alta adresa de facturare
          </button>
          <button
            class="btn btn-danger"
            @click="
              store.deleteUserAddress(
                getAddressIndex(store.userData.customerData.billing)
              )
            "
          >
            Sterge
          </button>
        </div>
      </div>

      <div v-else>
        <p>Nu ai nici o adresa de facturare</p>
        <a
          href="#user-addresses"
          v-if="userAddresses.length"
          class="btn btn-secondary"
        >
          Alege una dintre adresele existente
        </a>
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

    <div id="user-addresses" v-if="store.userData.customerData" class="py-5">
      <div
        v-for="(userAddress, userAddressIndex) in userAddresses"
        :key="userAddress"
      >
        <div v-if="!userAddress.shipping && !userAddress.billing">
          {{ userAddress }}
          <br />
          <button
            class="btn btn-secondary"
            @click="
              store.showUserAddressForm(
                'Editeaza adresa',
                'update',
                userAddressIndex
              )
            "
          >
            editeaza
          </button>
          <button
            class="btn btn-danger"
            @click="store.deleteUserAddress(userAddressIndex)"
          >
            sterge
          </button>
          <button
            class="btn btn-success"
            @click="store.updateUserAddressFor(userAddressIndex, 'shipping')"
          >
            seteaza ca adresa de livrare
          </button>
          <button
            class="btn btn-warning"
            @click="store.updateUserAddressFor(userAddressIndex, 'billing')"
          >
            seteaza ca adresa de facturare
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
