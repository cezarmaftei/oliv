<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { provide, ref } from "vue";
import { MutationType } from "pinia";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";
import FormCoupon from "@/components/form/FormCoupon.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";
import ProductCart from "@/components/product/ProductCart.vue";

const store = useOlivStore();
const route = useRoute();

const cartItemsInputs = ref([]);
provide("cartItemsInputs", cartItemsInputs);

const cartDrawerItems = ref([]);
provide("cartDrawerItems", cartDrawerItems);

defineProps({
  isCheckout: Boolean,
});

store.$subscribe((mutation, state) => {
  if (mutation.type === "patch function") {
    // This also calls updateCartTotals()
    store.mergeCartProducts();
  }
});
</script>

<template>
  <div class="cart-content">
    <UpdateLoading />
    <div v-if="store.cartData.items.length">
      <div
        class="cart-item"
        v-for="(cartItem, cartItemIndex) in store.cartData.items"
        :key="cartItem"
        :ref="
          () => {
            cartDrawerItems[cartItemIndex] = store.getProductById(cartItem.id);
          }
        "
      >
        <ProductCart
          :isCheckout="isCheckout"
          :cartItem="cartItem"
          :cartItemIndex="cartItemIndex"
        />
      </div>
      <div v-if="!store.cartData.coupon.codes.length && !isCheckout">
        <FormCoupon />
      </div>
      <div>
        <div class="d-flex cart-bordered-element">
          <div>Subtotal</div>
          <div class="ms-auto">{{ store.cartData.subTotal }} lei</div>
        </div>
        <div v-if="store.cartData.coupon.codes">
          <div
            v-for="couponData in store.cartData.coupon.codes"
            :key="couponData"
            class="d-flex align-items-center cart-bordered-element"
          >
            <div>Coupon "{{ couponData.code }}" discount:</div>
            <div class="ms-auto">{{ couponData.discount }}</div>
            <button
              class="btn btn-delete"
              v-if="!isCheckout"
              @click="store.removeOrderCoupon"
            ></button>
          </div>
        </div>
        <div class="d-flex cart-bordered-element">
          <div>Cost livrare</div>
          <div class="ms-auto">
            <strong>{{ store.cartData.totalShipping }}</strong>
          </div>
        </div>
        <div class="d-flex cart-bordered-element">
          <div>Total</div>
          <div class="ms-auto">
            <strong>{{ store.cartData.totalPrice }}</strong>
          </div>
        </div>
      </div>
      <div
        v-if="route.params.slug !== 'finalizare'"
        class="d-flex"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <router-link class="btn btn-success" to="/finalizare"
          >Checkout</router-link
        >
      </div>
    </div>
    <div v-else>
      <NoProductsInCart />
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-content {
  position: relative;
}

.cart-bordered-element {
  @include margin-top(2rem);
  padding-bottom: 1rem;
  border-bottom: 1px solid $gray-200;
}
</style>
