<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { MutationType } from "pinia";
import FormCoupon from "@/components/form/FormCoupon.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";
import ProductCart from "@/components/product/ProductCart.vue";
import CartHeader from "@/components/cart/CartHeader.vue";
import ItemPrice from "@/components/partials/ItemPrice.vue";
// import { onMounted } from "vue";

const store = useOlivStore();
const route = useRoute();

defineProps({
  isCheckout: Boolean,
  isOffCanvas: Boolean,
});

store.$subscribe((mutation, state) => {
  // This only happens for addresses
  if (mutation.type === "patch function") {
    // console.log("cart patched!");
    store.updateCartTotals();
  }
});
</script>

<template>
  <div class="cart-content">
    <CartHeader
      v-if="!isOffCanvas"
      :isCheckout="isCheckout"
      :isOffCanvas="false"
    />
    <div class="cart-items" v-if="store.getCartItems.length">
      <div class="overflow-hidden" :class="{ 'px-4': isOffCanvas }">
        <TransitionGroup name="add-remove-element">
          <div
            class="cart-item"
            v-for="(cartItem, cartItemIndex) in store.getCartItems"
            :key="cartItem"
          >
            <ProductCart
              :isCheckout="isCheckout"
              :isOffCanvas="isOffCanvas"
              :cartItem="cartItem"
              :cartItemIndex="cartItemIndex"
            />
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="px-4" v-else>
      <NoProductsInCart />
    </div>

    <div
      v-if="store.getCartItems.length"
      class="cart-totals"
      :class="{ 'd-flex flex-column flex-grow-1': isOffCanvas }"
    >
      <div class="cart-totals-inner sticky-spacing">
        <div class="cart-subtotal" :class="{ 'px-4': isOffCanvas }">
          <div class="d-flex cart-bordered-element mt-0">
            <div>Total produse</div>
            <div class="ms-auto">
              <strong><ItemPrice :price="store.cartData.subTotal" /></strong>
            </div>
          </div>

          <div v-if="store.cartData.coupon.codes.length">
            <div
              v-for="couponData in store.cartData.coupon.codes"
              :key="couponData"
              class="d-flex align-items-center cart-bordered-element"
            >
              <button
                type="button"
                class="btn btn-delete"
                @click="store.removeOrderCoupon"
              ></button>
              <div class="px-1">Discount cupon "{{ couponData.code }}":</div>
              <div class="ms-auto text-nowrap">
                <strong
                  ><ItemPrice :price="store.cartData.totalDiscount"
                /></strong>
              </div>
            </div>
          </div>

          <div
            v-if="
              !store.cartData.coupon.codes.length &&
              store.getCustomDiscount() &&
              store.cartData.totalDiscount > 0
            "
          >
            <div class="d-flex align-items-center cart-bordered-element">
              <div
                v-text="store.customDiscounts.notificare_checkout_discount"
              ></div>
              <div class="ms-auto text-nowrap">
                <strong
                  ><ItemPrice :price="store.cartData.totalDiscount"
                /></strong>
              </div>
            </div>
          </div>

          <div v-if="!store.cartData.coupon.codes.length">
            <FormCoupon />
          </div>

          <div
            class="cart-bordered-element"
            v-if="store.cartData.deliveryMethod !== 'pickup'"
          >
            <div class="d-flex">
              <div class="text-nowrap me-1">Cost livrare:</div>
              <div class="ms-auto">
                <span
                  v-if="!isCheckout && store.cartData.totalShipping === false"
                >
                  Se calculeaza la pasul urmator.
                </span>
                <span
                  v-else-if="
                    isCheckout &&
                    store.cartData.totalShipping === false &&
                    store.cartData.deliveryMethod !== 'pickup'
                  "
                >
                  Va fi calculat dupa ce introduci adresa si localitatea.
                </span>
                <ItemPrice
                  v-else-if="
                    store.cartData.totalShipping > 0 &&
                    store.cartData.deliveryMethod !== 'pickup'
                  "
                  :price="store.cartData.totalShipping"
                />
                <span v-else-if="store.cartData.totalShipping === 0"
                  >Gratuit</span
                >
              </div>
            </div>
          </div>
        </div>

        <div
          class="cart-total flex-grow-1 d-flex flex-column justify-content-end"
        >
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
            :data-bs-dismiss="isOffCanvas ? 'offcanvas' : ''"
            aria-label="Close"
          >
            <router-link class="btn btn-primary reverse" to="/finalizare"
              >Plaseaza comanda</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-bordered-element {
  margin-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid $gray-200;

  @include media-breakpoint-up(lg) {
    margin-top: 1.5rem;
    padding-bottom: 1.5rem;
  }
}

.cart-total {
  font-family: $font-family-lanekcut;
  font-size: 3.2rem;
  line-height: 0.8;
  width: 100%;

  .btn {
    padding: 1.5rem 2.5rem;
    font-size: 3rem;
    width: 100%;
  }
}

@include media-breakpoint-up(xs) {
  .cart-content {
    font-size: 1.4rem;
  }
}

@include media-breakpoint-up(md) {
  .cart-page-inner {
    .cart-content {
      display: grid;
      column-gap: 3rem;
      grid-template-columns: calc(50% - 1.5rem) calc(50% - 1.5rem);
    }

    .cart-page-header {
      grid-column: 1 / 1;
      grid-row: 1;
    }

    .cart-items {
      grid-column: 1 / 1;
      grid-row: 2;
    }

    .cart-totals {
      grid-column: 2;
      grid-row: 1 / 3;

      .cart-totals-inner {
        position: sticky;
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .cart-page-inner {
    .cart-content {
      grid-template-columns: calc(50% - 3.5rem) calc(50% - 3.5rem);
      column-gap: 7rem;
    }
  }

  .cart-total {
    .btn {
      font-size: 3.2rem;
      padding-top: 2rem;
      padding-bottom: 2rem;
    }
  }
}

@include media-breakpoint-up(xl) {
  .cart-page-inner {
    .cart-content {
      font-size: 1.6rem;
    }
    .cart-totals {
      margin-left: auto;
    }
  }
}
</style>
