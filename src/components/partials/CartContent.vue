<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { provide, ref } from "vue";
import { MutationType } from "pinia";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";
import ErrorCoupon from "@/components/partials/ErrorCoupon.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";
import ProductCart from "@/components/product/ProductCart.vue";

const store = useOlivStore();
const route = useRoute();

const cartItemsInputs = ref([]);
provide("cartItemsInputs", cartItemsInputs);

const cartDrawerItems = ref([]);
provide("cartDrawerItems", cartDrawerItems);

const couponCode = ref(false);
provide("couponCode", couponCode);

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
        <form @submit.prevent="store.addOrderCoupon(couponCode.value)">
          <input
            type="text"
            ref="couponCode"
            placeholder="Cod promotional..."
            required
          />
          <button type="submit" class="btn btn-primary">Aplica codul</button>
          <div v-if="store.cartData.coupon.error">
            <ErrorCoupon :errorMsg="store.cartData.coupon.error" />
          </div>
        </form>
      </div>
      <div>
        <div class="d-flex">
          <div>Subtotal</div>
          <div>{{ store.cartData.subTotal }}</div>
        </div>
        <div v-if="store.cartData.coupon.codes">
          <div
            v-for="couponData in store.cartData.coupon.codes"
            :key="couponData"
            class="d-flex"
          >
            <div>Coupon "{{ couponData.code }}" discount:</div>
            <div>{{ couponData.discount }}</div>
            <button
              class="btn btn-primary"
              v-if="!isCheckout"
              @click="store.removeOrderCoupon"
            >
              x
            </button>
          </div>
        </div>
        <div class="d-flex">
          <div>Cost livrare</div>
          <div>
            <strong>{{ store.cartData.totalShipping }}</strong>
          </div>
        </div>
        <div class="d-flex">
          <div>Total</div>
          <div>
            <strong>{{ store.cartData.totalPrice }}</strong>
          </div>
        </div>
      </div>
      <div v-if="route.params.slug !== 'finalizare'" class="d-flex">
        <router-link
          class="btn btn-success"
          @click="store.showCartDrawer = false"
          to="/finalizare"
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
</style>
