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
  <div class="user-address pb-3 mb-3">
    <div class="user-address-shipping" v-if="addressType === 'shipping'">
      <transition name="height-element">
        <div v-if="!showEditForm">
          <h4 class="mb-2" v-if="addressIndex === 0">
            Adresa principala pentru livrare
          </h4>
          <h4 class="mb-2" v-else>Adresa secundara pentru livrare</h4>
          <div class="row">
            <div class="col-12 col-lg-6 address-details">
              <table>
                <tr
                  class="d-block d-sm-table-row"
                  v-for="(fieldData, fieldName) in store.shippingFieldsMapping"
                  :key="fieldName"
                >
                  <td
                    class="d-block d-sm-table-cell"
                    v-if="
                      fieldData.type !== 'hidden' &&
                      address[fieldName].length > 0
                    "
                  >
                    {{ fieldData.name }}:
                  </td>
                  <td
                    class="d-block d-sm-table-cell"
                    v-if="
                      fieldData.type !== 'hidden' &&
                      address[fieldName].length > 0
                    "
                  >
                    {{ address[fieldName] }}
                  </td>
                </tr>
              </table>

              <AddressFees :address="address" />
            </div>

            <div
              class="col-12 col-lg-6 col-xl-5 ps-lg-3 mt-2 mt-lg-0 ms-xl-auto"
            >
              <div class="row g-1">
                <div class="col-12" v-if="!isCheckout && addressIndex > 0">
                  <button
                    class="btn btn-primary"
                    @click="
                      store.handleUserAddress(
                        'setfirst',
                        addressType,
                        addressIndex
                      )
                    "
                  >
                    Seteaza ca adresa principala
                  </button>
                </div>
                <div class="col-12 col-xs-6" v-if="!isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="showEditForm = !showEditForm"
                  >
                    Editeaza adresa
                  </button>
                </div>
                <div class="col-12 col-xs-6" v-if="!isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="deleteUserAddress()"
                  >
                    Sterge adresa
                  </button>
                </div>

                <div class="col-12" v-if="isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="emitAddressChanged()"
                  >
                    Alege adresa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="height-element">
        <div v-if="showEditForm && !isCheckout">
          <FormShippingAddress
            :formData="address"
            :addressIndex="addressIndex"
            @cancel-action="showEditForm = false"
          />
        </div>
      </transition>
    </div>

    <div class="user-address-billing" v-if="addressType === 'billing'">
      <transition name="height-element">
        <div v-if="!showEditForm">
          <h4 class="mb-2" v-if="addressIndex === 0">
            Adresa principala pentru facturare
          </h4>
          <h4 class="mb-2" v-else>Adresa secundara pentru facturare</h4>
          <div class="row">
            <div class="col-12 col-lg-6 address-details">
              <table>
                <tr
                  class="d-block d-sm-table-row"
                  v-for="(
                    fieldData, fieldName, fieldIndex
                  ) in store.billingFieldsMapping"
                  :key="fieldName"
                >
                  <td
                    class="d-block d-sm-table-cell"
                    v-if="
                      fieldData.type !== 'hidden' &&
                      address[fieldName].length > 0
                    "
                  >
                    {{ fieldData.name }}:
                  </td>
                  <td
                    class="d-block d-sm-table-cell"
                    v-if="
                      fieldData.type !== 'hidden' &&
                      address[fieldName].length > 0
                    "
                  >
                    {{ address[fieldName] }}
                  </td>
                </tr>
              </table>
            </div>
            <div
              class="col-12 col-lg-6 col-xl-5 ps-lg-3 mt-2 mt-lg-0 ms-xl-auto"
            >
              <div class="row g-1">
                <div class="col-12" v-if="addressIndex !== 0 && !isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="
                      store.handleUserAddress(
                        'setfirst',
                        addressType,
                        addressIndex
                      )
                    "
                  >
                    Seteaza ca adresa principala
                  </button>
                </div>
                <div class="col-12 col-xs-6" v-if="!isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="showEditForm = !showEditForm"
                  >
                    Editeaza adresa
                  </button>
                </div>
                <div class="col-12 col-xs-6" v-if="!isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="deleteUserAddress()"
                  >
                    Sterge adresa
                  </button>
                </div>
                <div class="col-12" v-if="isCheckout">
                  <button
                    class="btn btn-primary"
                    @click="emitAddressChanged()"
                  >
                    Alege adresa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <div v-if="showEditForm">
        <div class="p-3 mb-5 bg-white form-wrapper">
          <transition name="height-element">
            <FormBillingAddress
              :formData="address"
              :addressIndex="addressIndex"
              @address-added-success="showEditForm = false"
              @cancel-action="showEditForm = false"
            />
          </transition>
        </div>
      </div>
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

.btn {
  width: 100%;
}

td:first-child {
  font-weight: $font-weight-bold;
}

tr {
  margin-bottom: 1rem;
}

.form-wrapper {
  @include global-border;
}

@include media-breakpoint-up(sm) {
  td {
    vertical-align: top;
  }

  td:first-child {
    font-weight: $font-weight-normal;
    padding-right: 1rem;
  }
}

@include media-breakpoint-up(lg) {
  .mt-lg-0 {
    margin-top: 0 !important;
  }
}
</style>
