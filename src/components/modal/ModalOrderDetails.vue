<script setup>
import BtnClose from "../button/BtnClose.vue";
import OrderDetails from "../partials/OrderDetails.vue";

defineProps(["order"]);

const emits = defineEmits(["reOrder"]);
const reOrderItems = () => {
  emits("reOrder");
};
</script>

<template>
  <div
    class="modal fade"
    id="order-details-modal"
    tabindex="-1"
    aria-labelledby="order-details-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <BtnClose
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <OrderDetails v-if="order" :order="order" />

          <button
            type="button"
            class="btn btn-primary d-block mx-auto mt-4"
            data-bs-dismiss="modal"
            @click="reOrderItems()"
          >
            Comanda din nou
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
