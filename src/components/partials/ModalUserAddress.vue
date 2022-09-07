<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import FormUserAddress from "@/components/form/FormUserAddress.vue";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";

const store = useOlivStore();
</script>

<template>
  <div
    class="address-form-modal"
    :class="store.addressForm.show ? 'show' : false"
  >
    <div class="modal-body">
      <UpdateLoading />
      <button
        @click="
          store.addressForm.show = false;
          store.resetAddressForm();
        "
      >
        X
      </button>
      <h4>{{ store.addressForm.title }}</h4>
      <FormUserAddress />
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-form-modal {
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
    z-index: 2000;
  }
}

.modal-body {
  position: relative;
}
</style>
