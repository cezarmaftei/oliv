<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import ErrorCoupon from "@/components/error/ErrorCoupon.vue";
import { ref } from "vue";

const store = useOlivStore();

const couponCode = ref("");
</script>

<template>
  <form
    class="form-coupon d-flex flex-wrap"
    @submit.prevent="
      store.addOrderCoupon(couponCode);
      couponCode = '';
    "
  >
    <input type="text" v-model="couponCode" placeholder="xxxxxx" required />
    <button type="submit" class="btn">Aplica codul</button>
    <transition name="scale-element">
      <ErrorCoupon v-if="store.cartData.coupon.errorMsg" />
    </transition>
  </form>
</template>

<style scoped lang="scss">
::placeholder {
  color: $body-color;
  opacity: 1;
}

.form-coupon {
  box-shadow: 0px 0px 20px 0px rgba(228, 229, 229, 1);
  padding: 1rem;

  .btn,
  input {
    flex: 0 0 50%;
    max-width: 50%;
  }

  input {
    border: 0;
    padding: 0;
    background: none;
    font-family: $font-family-lanekcut;
    font-size: 2.2rem;
    line-height: 0.8;
    color: $body-color;
    padding-left: 1rem;

    &:focus,
    &:focus-visible {
      outline: 0;
    }
  }

  .btn {
    background: $gray-500;
    padding-left: 1rem;
    padding-right: 1rem;

    &:hover {
      background: $yellow-200;
      color: $body-color;
    }
  }

  .form-error {
    flex: 0 0 100%;
    max-width: 100%;
    padding: 1rem;
  }

  @include media-breakpoint-up(xs) {
    .btn,
    input {
      font-size: 2.6rem;
    }
  }
}
</style>
