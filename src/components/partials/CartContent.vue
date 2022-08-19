<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import { ref } from "vue";

const store = useOlivStore();

const cartItemsInputs = ref([]);
const cartDrawerItems = ref([]);
const productExtras = ref([]);
const couponCode = ref(false);

const showCouponError = computed(() => {
  setTimeout(() => {
    store.cartData.coupon.error = false;
    couponCode.value.value = "";
  }, 5000);
  return store.cartData.coupon.error;
});
</script>

<template>
  <div class="cart-content">
    <div
      class="cart-update-overlay"
      v-show="store.cartData.cartLiveUpdate"
    ></div>
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

            <div
              class="price"
              v-html="cartDrawerItems[cartItemIndex].price_html"
            ></div>

            <div class="cart-item-actions">
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
                  store.updateCartItems(
                    'update',
                    cartItem,
                    cartItemsInputs[cartItemIndex].value
                  )
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
                  {{ extra.extraName }}<br />
                  <strong>{{ extra.extraPrice }}</strong> lei
                </div>
              </div>
            </div>

            <div class="total">{{ cartItem.itemTotal }}</div>

            <button @click="store.removeFromCart(cartItemIndex)">x</button>
          </div>
        </div>
      </div>
      <div>
        <form @submit.prevent="store.addOrderCoupon(couponCode.value)">
          <input
            type="text"
            ref="couponCode"
            placeholder="Cod promotional..."
            required
          />
          <button type="submit" class="btn btn-primary">Aplica codul</button>
          <div v-if="store.cartData.coupon.error">
            {{ showCouponError }}
          </div>
        </form>
      </div>
      <div>
        <div class="d-flex">
          <div>Subtotal</div>
          <div>{{ store.cartData.totalPrice }}</div>
        </div>
        <div v-if="store.cartData.coupon.codes">
          <div
            v-for="couponData in store.cartData.coupon.codes"
            :key="couponData"
            class="d-flex"
          >
            <div>Coupon "{{ couponData.code }}" discount:</div>
            <div>{{ couponData.discount }}</div>
            <button class="btn btn-primary" @click="store.removeOrderCoupon">
              x
            </button>
          </div>
        </div>
        <div class="d-flex">
          <div>Total</div>
          <div>
            <strong>{{
              store.cartData.totalPrice - store.cartData.totalDiscount
            }}</strong>
          </div>
        </div>
      </div>
      <div class="d-flex">
        <button class="btn btn-secondary">Checkout</button>
      </div>
    </div>
    <div v-else>
      <p>Nu ai nici un producs in cos.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-content {
  position: relative;
}

.cart-update-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  left: 0;
  top: 0;
  background: rgba($white, 0.8);
}
</style>
