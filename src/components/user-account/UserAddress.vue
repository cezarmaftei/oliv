<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import AddressFees from "@/components/partials/AddressFees.vue";
import FormShippingAddress from "../form/FormShippingAddress.vue";
import { ref } from "vue";
import FormBillingAddress from "../form/FormBillingAddress.vue";

const store = useOlivStore();
const props = defineProps({
  addressType: String,
  address: Object,
  addressIndex: Number,
  isCheckout: Boolean,
});

const emits = defineEmits(["addressChanged"]);

const emitAddressChanged = () => {
  store.handleUserAddress("setfirst", props.addressType, props.addressIndex);
  emits("addressChanged");
};

const deleteUserAddress = () => {
  if (window.confirm("Esti sigur ca vrei sa stergi adresa?")) {
    store.handleUserAddress("delete", props.addressType, props.addressIndex);
  }
};

const showEditForm = ref(false);
</script>

<template>
  <div class="user-address pb-2 mb-2">
    <div class="user-address-shipping" v-if="addressType === 'shipping'">
      <transition name="height-element">
        <div v-if="!showEditForm">
          <h5 v-if="addressIndex === 0">Adresa implicta pentru livrare</h5>
          <div class="address-details">
            <p class="h5">
              <span
                v-for="(
                  fieldData, fieldName, fieldIndex
                ) in store.shippingFieldsMapping"
                :key="fieldName"
              >
                <span
                  v-if="
                    fieldData.type !== 'hidden' && address[fieldName].length > 0
                  "
                >
                  {{ fieldData.name }}:
                  <span class="color-gray">{{ address[fieldName] }}</span
                  >,
                  <br v-if="fieldIndex % 3 === 0" />
                </span>
              </span>
            </p>
          </div>

          <AddressFees :address="address" />

          <div class="row mt-2">
            <div class="col-auto" v-if="!isCheckout">
              <button
                class="btn btn-outline-dark"
                @click="showEditForm = !showEditForm"
              >
                Editeaza adresa
              </button>
            </div>
            <div class="col-auto" v-if="!isCheckout && addressIndex > 0">
              <button
                class="btn btn-outline-dark reverse"
                @click="
                  store.handleUserAddress('setfirst', addressType, addressIndex)
                "
              >
                Seteaza ca adresa implicita
              </button>
            </div>
            <div class="col-auto" v-if="!isCheckout">
              <button
                class="btn btn-outline-dark red"
                @click="deleteUserAddress()"
              >
                Sterge adresa
              </button>
            </div>

            <div class="col-auto" v-if="isCheckout">
              <button
                class="btn btn-outline-dark reverse"
                @click="emitAddressChanged()"
              >
                Alege adresa
              </button>
            </div>
          </div>
        </div>
      </transition>

      <transition name="height-element">
        <div v-if="showEditForm && !isCheckout">
          <FormShippingAddress
            :formData="address"
            :addressIndex="addressIndex"
            @address-added-success="showEditForm = false"
            @cancel-action="showEditForm = false"
          />
        </div>
      </transition>
    </div>

    <div class="user-address-billing" v-if="addressType === 'billing'">
      <transition name="height-element">
        <div v-if="!showEditForm">
          <h5 v-if="addressIndex === 0">Adresa implicta pentru facturare</h5>
          <div class="address-details">
            <p class="h5">
              <span
                v-for="(
                  fieldData, fieldName, fieldIndex
                ) in store.billingFieldsMapping"
                :key="fieldName"
              >
                <span
                  v-if="
                    fieldData.type !== 'hidden' && address[fieldName].length > 0
                  "
                >
                  {{ fieldData.name }}:
                  <span class="color-gray">{{ address[fieldName] }}</span
                  >,
                  <br v-if="fieldIndex % 3 === 0" />
                </span>
              </span>
            </p>
          </div>

          <div class="row mt-2">
            <div class="col-auto" v-if="!isCheckout">
              <button
                class="btn btn-outline-dark"
                @click="showEditForm = !showEditForm"
              >
                Editeaza adresa
              </button>
            </div>
            <div class="col-auto" v-if="addressIndex !== 0 && !isCheckout">
              <button
                class="btn btn-outline-dark reverse"
                @click="
                  store.handleUserAddress('setfirst', addressType, addressIndex)
                "
              >
                Seteaza ca adresa implicita
              </button>
            </div>
            <div class="col-auto" v-if="!isCheckout">
              <button
                class="btn btn-outline-dark red"
                @click="deleteUserAddress()"
              >
                Sterge adresa
              </button>
            </div>
            <div class="col-auto" v-if="isCheckout">
              <button
                class="btn btn-outline-dark reverse"
                @click="emitAddressChanged()"
              >
                Alege adresa
              </button>
            </div>
          </div>
        </div>
      </transition>

      <transition name="height-element">
        <FormBillingAddress
          v-if="showEditForm"
          :formData="address"
          :addressIndex="addressIndex"
          @address-added-success="showEditForm = false"
          @cancel-action="showEditForm = false"
        />
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-address {
  border-bottom: 1px solid $gray-300;
}

h5,
.color-gray {
  color: $gray-500;
  line-height: 1;
}
</style>
