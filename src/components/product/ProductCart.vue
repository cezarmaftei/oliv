<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import ErrorProduct from "@/components/partials/ErrorProduct.vue";
import { inject, ref } from "vue";

const store = useOlivStore();

const cartItemsInputs = inject("cartItemsInputs");
const cartDrawerItems = inject("cartDrawerItems");
const productExtras = ref([]);

defineProps({
  cartItemIndex: Number,
  cartItem: Object,
  isCheckout: Boolean,
});
</script>

<template>
  <div
    class="card card-product-cart d-flex"
    v-if="cartDrawerItems[cartItemIndex]"
  >
    <ErrorProduct v-if="cartItem.errorMsg" :productIndex="cartItemIndex" />
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
          @click="store.updateCartItems('sub', cartItem, cartItemIndex, 1)"
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
          @click="store.updateCartItems('add', cartItem, cartItemIndex, 1)"
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

                productExtras[cartItem.id][extra._id] = {
                  element: el,
                  price: extra._price,
                };
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

      <button v-if="!isCheckout" @click="store.removeFromCart(cartItemIndex)">
        x
      </button>
    </div>
  </div>
</template>
