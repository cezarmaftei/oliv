<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { provide, ref } from "vue";
import { MutationType } from "pinia";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";
import FormCoupon from "@/components/form/FormCoupon.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";
import ProductCart from "@/components/product/ProductCart.vue";
import CartHeader from "@/components/cart/CartHeader.vue";
import ItemPrice from "@/components/partials/ItemPrice.vue";

const store = useOlivStore();
const route = useRoute();

const cartItemsInputs = ref([]);
provide("cartItemsInputs", cartItemsInputs);

const cartDrawerItems = ref([]);
provide("cartDrawerItems", cartDrawerItems);

defineProps({
  isCheckout: Boolean,
  isOffCanvas: Boolean,
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

    <CartHeader v-if="!isOffCanvas" :isOffCanvas="false" />

    <div class="cart-items" v-if="store.cartData.items.length">
      <div :class="{ 'px-4': isOffCanvas }">
        <div
          class="cart-item"
          v-for="(cartItem, cartItemIndex) in store.cartData.items"
          :key="cartItem"
          :ref="
            () => {
              cartDrawerItems[cartItemIndex] = store.getProductById(
                cartItem.id
              );
            }
          "
        >
          <ProductCart
            :isCheckout="isCheckout"
            :isOffCanvas="isOffCanvas"
            :cartItem="cartItem"
            :cartItemIndex="cartItemIndex"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <NoProductsInCart />
    </div>
  </div>

  <div
    v-if="store.cartData.items.length"
    class="cart-totals"
    :class="{ 'd-flex flex-column flex-grow-1': isOffCanvas }"
  >
    <div class="cart-subtotal" :class="{ 'px-4': isOffCanvas }">
      <div class="d-flex cart-bordered-element">
        <div>Total produse</div>
        <div class="ms-auto">
          <strong><ItemPrice :price="store.cartData.subTotal" /></strong>
        </div>
      </div>
      <div v-if="store.cartData.coupon.codes">
        <div
          v-for="couponData in store.cartData.coupon.codes"
          :key="couponData"
          class="d-flex align-items-center cart-bordered-element"
        >
          <button
            class="btn btn-delete"
            v-if="!isCheckout"
            @click="store.removeOrderCoupon"
          ></button>
          <div class="px-1">Discount cupon "{{ couponData.code }}":</div>
          <div class="ms-auto text-nowrap">
            <strong><ItemPrice :price="couponData.discount" /></strong>
          </div>
        </div>
      </div>
      <div v-if="!store.cartData.coupon.codes.length">
        <FormCoupon />
      </div>
      <div class="d-flex cart-bordered-element">
        <div
          class="d-flex"
          v-if="isCheckout || store.cartData.addresses.shipping"
        >
          <div>Cost livrare</div>
          <ItemPrice class="ms-auto" :price="store.cartData.totalShipping" />
        </div>
        <div v-else>Costul livrarii se calculeaza la pasul urmator.</div>
      </div>
    </div>

    <div class="cart-total flex-grow-1 d-flex flex-column justify-content-end">
      <div class="d-flex py-4" :class="{ 'px-4 mt-auto': isOffCanvas }">
        <div v-if="isCheckout">Total</div>
        <div v-else>Subtotal</div>
        <div class="ms-auto">
          <ItemPrice :price="store.cartData.totalPrice" />
        </div>
      </div>
      <div
        v-if="route.params.slug !== 'finalizare'"
        class="d-flex"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <router-link class="btn btn-outline-dark reverse" to="/finalizare"
          >Plaseaza comanda</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-bordered-element {
  @include margin-top(2rem);
  padding-bottom: 1rem;
  border-bottom: 1px solid $gray-200;
}

.cart-total {
  font-family: $font-family-lanekcut;
  font-size: 3.2rem;
  line-height: 0.8;
  width: 100%;

  .btn {
    font-size: 3.2rem;
    width: 100%;
    background-size: 100%;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}

@include media-breakpoint-up(xs) {
  .cart-content {
    font-size: 1.4rem;
  }
}

@include media-breakpoint-up(lg) {
  .cart-page-inner {
    .cart-content {
      flex-grow: 1;
      max-width: 55%;
    }
    .cart-totals {
      background: $white;
      max-width: 380px;
      margin-left: auto;
      position: sticky;
      top: 110px;
    }

    .cart-subtotal {
      > .cart-bordered-element:first-child {
        margin-top: 0;
      }
    }

    .cart-subtotal,
    .cart-total > *:first-child {
      border: 2px solid $border-color;
      border-bottom: 0;
      @include padding(4rem 4rem 0);
    }

    .cart-total > *:first-child {
      border-top: 0;
      @include padding(4rem 4rem 0);
    }
  }
}
</style>
