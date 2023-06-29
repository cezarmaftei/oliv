<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { Modal } from "bootstrap";
import { onMounted, ref } from "vue";
import BtnClose from "../button/BtnClose.vue";

const store = useOlivStore();
const shippingModal = ref(false);
onMounted(() => {
  shippingModal.value = new Modal("#shop-closed-modal");
  shippingModal.value.show();
});
const closeModal = () => {
  shippingModal.value.hide();
};
</script>
<template>
  <div
    class="modal fade shop-closed-modal"
    id="shop-closed-modal"
    tabindex="-1"
    aria-labelledby="shop-closed-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header pb-0 pe-10">
          <h2 id="shop-closed-modal-label">
            MOMENTAN SUNTEM IN AFARA ORELOR DE PROGRAM.
          </h2>
          <BtnClose
            type="button"
            class="btn-close white"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <p>In schimb, poti plasa o pre-comanda pentru urmatoarea zi.</p>

          <button @click="closeModal" class="btn btn-primary reverse">
            Am Inteles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop-closed-modal {
  .modal-content {
    background: url("/popupIMG.jpg") no-repeat center center / cover;
    color: $white;
    border: 0;

    &:before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      z-index: 0;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba($black, 0.3);
    }
  }

  .btn-primary.reverse {
    &:hover {
      color: $white;
      border-color: $white;
    }
  }

  .modal-header,
  .modal-body {
    position: relative;
    z-index: 10;
  }

  .modal-header {
    @include padding(8rem 8rem 0);
  }

  .modal-body {
    @include padding(0 8rem 8rem);
  }
}
</style>
