<script setup>
import OrderDetails from "./OrderDetails.vue";
import BtnClose from "../button/BtnClose.vue";
defineProps({
  order: Object,
});
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
          <OrderDetails :order="order" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-dark">
            Comanda din nou
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
