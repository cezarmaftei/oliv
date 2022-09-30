<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import AddressFees from "@/components/partials/AddressFees.vue";
import FormShippingAddress from "../form/FormShippingAddress.vue";
import { ref } from "vue";
import FormBillingAddress from "../form/FormBillingAddress.vue";

const store = useOlivStore();
defineProps({
  addressType: String,
  address: Object,
  addressIndex: Number,
  isCheckout: Boolean,
});

const showEditForm = ref(false);
</script>

<template>
  <div class="user-address">
    <div class="user-address-shipping mb-5" v-if="addressType === 'shipping'">
      <transition name="height-element">
        <div v-if="!showEditForm">
          <h4 v-if="addressIndex === 0">Adresa implicta pentru livrare</h4>
          {{ address.shipping_first_name }}, <br />
          {{ address.shipping_address_1 }}, {{ address.shipping_city }}, <br />
          {{ address.shipping_email }}, {{ address.shipping_phone }} <br />
          <AddressFees :address="address" />
        </div>
      </transition>

      <button
        v-if="!isCheckout"
        class="btn"
        @click="showEditForm = !showEditForm"
      >
        Editeaza adresa
      </button>

      <button
        v-if="!isCheckout"
        class="btn"
        @click="store.handleUserAddress('delete', addressType, addressIndex)"
      >
        Sterge adresa
      </button>

      <button
        v-if="!isCheckout && addressIndex > 0"
        class="btn"
        @click="store.handleUserAddress('setfirst', addressType, addressIndex)"
      >
        Seteaza ca adresa implicita
      </button>

      <button v-if="isCheckout" class="btn btn-outline-dark reverse">
        Alege adresa
      </button>

      <transition name="height-element">
        <FormShippingAddress
          v-if="showEditForm && !isCheckout"
          :formData="address"
          :addressIndex="addressIndex"
          @address-added-success="showEditForm = false"
        />
      </transition>
    </div>

    <div class="user-address-billing mb-5" v-if="addressType === 'billing'">
      <transition name="height-element">
        <div v-if="!showEditForm">
          <h4 v-if="addressIndex === 0">Adresa implicta pentru facturare</h4>
          {{ address.billing_first_name }}
          <span v-if="address.billing_last_name">
            {{ address.billing_last_name }}</span
          >, {{ address.billing_address_1
          }}<span v-if="address.billing_address_2">
            {{ address.billing_address_2 }}</span
          >, {{ address.billing_city }}, <br />{{ address.billing_phone }}
        </div>
      </transition>

      <button class="btn" @click="showEditForm = !showEditForm">
        Editeaza adresa
      </button>

      <button
        class="btn"
        @click="store.handleUserAddress('delete', addressType, addressIndex)"
      >
        Sterge adresa
      </button>

      <button
        v-if="addressIndex !== 0"
        class="btn"
        @click="store.handleUserAddress('setfirst', addressType, addressIndex)"
      >
        Seteaza ca adresa implicita
      </button>

      <transition name="height-element">
        <FormBillingAddress
          v-if="showEditForm"
          :formData="address"
          :addressIndex="addressIndex"
          @address-added-success="showEditForm = false"
        />
      </transition>
    </div>
  </div>
</template>
