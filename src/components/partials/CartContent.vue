<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { provide, ref } from "vue";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";
import ErrorCoupon from "@/components/partials/ErrorCoupon.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";

const store = useOlivStore();
const route = useRoute();

const cartItemsInputs = ref([]);
const cartDrawerItems = ref([]);
const productExtras = ref([]);
const couponCode = ref(false);
provide("couponCode", couponCode);

defineProps({
  isCheckout: Boolean,
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
        <div class="d-flex" v-if="cartDrawerItems[cartItemIndex]">
          <figure>
            <img :src="cartDrawerItems[cartItemIndex].images[0].src" />
          </figure>
          <div>
            <h4>{{ cartDrawerItems[cartItemIndex].name }}</h4>
            <strong v-if="cartDrawerItems[cartItemIndex].weight"
              >{{ cartDrawerItems[cartItemIndex].weight
              }}<span
                v-if="
                  cartDrawerItems[cartItemIndex].categories.filter(
                    (cat) => cat.slug === 'bauturi'
                  ).length > 0
                "
                >g</span
              ><span v-else>g</span></strong
            >

            <div
              v-if="cartDrawerItems[cartItemIndex].short_description"
              v-html="cartDrawerItems[cartItemIndex].short_description"
            ></div>

            <div class="d-flex">
              <div
                class="price"
                v-html="cartDrawerItems[cartItemIndex].price_html"
              ></div>

              <div v-if="isCheckout">X {{ cartItem.productQty }}</div>
            </div>

            <div v-if="!isCheckout" class="cart-item-actions">
              <button
                @click="
                  store.updateCartItems('sub', cartItem, cartItemIndex, 1)
                "
              >
                -
              </button>
              <input
                type="number"
                min="0"
                :ref="(el) => (cartItemsInputs[cartItemIndex] = el)"
                @keyup="
                  if (cartItemsInputs[cartItemIndex].value)
                    store.updateCartItems(
                      'update',
                      cartItem,
                      cartItemIndex,
                      cartItemsInputs[cartItemIndex].value
                    );
                "
                :value="cartItem.productQty"
              />
              <button
                @click="
                  store.updateCartItems('add', cartItem, cartItemIndex, 1)
                "
              >
                +
              </button>
            </div>

            <div
              v-if="cartItem.productExtras.length > 0"
              class="cart-item-extras-actions"
            >
              <div v-for="extra in cartItem.productExtras" :key="extra">
                <button
                  v-if="!isCheckout"
                  @click="
                    store.handleExtra(
                      'sub',
                      productExtras[cartItem.id][extra._id],
                      cartItem,
                      extra,
                      false
                    )
                  "
                >
                  -
                </button>
                <input
                  :disabled="isCheckout"
                  type="number"
                  min="0"
                  max="10"
                  :ref="
                    (el) => {
                      if (!productExtras[cartItem.id])
                        productExtras[cartItem.id] = {};

                      productExtras[cartItem.id][extra._id] = el;
                    }
                  "
                  :value="extra.extraQty"
                  @keyup="
                    store.handleExtra(
                      'update',
                      productExtras[cartItem.id][extra._id],
                      cartItem,
                      extra,
                      false
                    )
                  "
                />
                <button
                  v-if="!isCheckout"
                  @click="
                    store.handleExtra(
                      'add',
                      productExtras[cartItem.id][extra._id],
                      cartItem,
                      extra,
                      false
                    )
                  "
                >
                  +
                </button>
                <div class="extra-name">
                  <span v-if="isCheckout">X</span>
                  {{ extra.extraName }}<br />
                  <strong>{{ extra.extraPrice }}</strong> lei
                </div>
              </div>
            </div>

            <div class="total">{{ cartItem.itemTotal }}</div>

            <button
              v-if="!isCheckout"
              @click="store.removeFromCart(cartItemIndex)"
            >
              x
            </button>
          </div>
        </div>
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
