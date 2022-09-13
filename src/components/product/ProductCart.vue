<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";
import ErrorProduct from "@/components/partials/ErrorProduct.vue";
import LoadImage from "@/components/partials/LoadImage.vue";
import IconDelete from "@/components/icons/IconDelete.vue";

const store = useOlivStore();

const cartDrawerItems = inject("cartDrawerItems");

const props = defineProps({
  cartItemIndex: Number,
  cartItem: Object,
  isCheckout: Boolean,
});

/**
 *
 * @param {String/Float} value the new value OR the value to be added/removed
 * @param {Bool} isNewValue if true it means that value is replacing the old value
 * @param {Bool} isFocusOut if true and value is empty or smaller than 1, remove the product from cart
 */
const updateCartItemQty = (value, isNewValue) => {
  const addedValue = parseFloat(value);

  const oldValue = store.cartData.items[props.cartItemIndex].productQty;
  let newValue = isNewValue ? addedValue : oldValue + addedValue;

  if (newValue < 1) {
    removeFromCart();
    return;
  }

  if (isNaN(newValue)) newValue = 1;
  store.$patch(
    (state) => (state.cartData.items[props.cartItemIndex].productQty = newValue)
  );
};

/**
 * Update cart item extra qty
 */
const updateCartItemExtraQty = (extraIndex, value, isNewValue, isFocusOut) => {
  const addedValue = parseFloat(value);

  // He didn't stopped typing
  if (isNaN(addedValue) && !isFocusOut) return;

  const oldValue =
    store.cartData.items[props.cartItemIndex].productExtras[extraIndex]
      .extraQty;
  let newValue = isNewValue ? addedValue : oldValue + addedValue;

  // If he entered negative number or left blank
  if (newValue < 0 || isNaN(newValue)) {
    // Do not patch
    // The following line is triggering a reactive change
    // If deleted, sometimes the user can add a negative number and the input value doesn't update
    store.cartData.items[props.cartItemIndex].productExtras[
      extraIndex
    ].extraQty = newValue;
    newValue = 0;
  }

  // Update with new value
  store.$patch(
    (state) =>
      (state.cartData.items[props.cartItemIndex].productExtras[
        extraIndex
      ].extraQty = newValue)
  );
};

/**
 * Remove product from cart
 */
const removeFromCart = () => {
  // Remove
  store.$patch((state) => {
    state.cartData.items.splice(props.cartItemIndex, 1);
  });
};
</script>

<template>
  <div
    class="card card-product-cart bg-white d-flex p-1"
    v-if="cartDrawerItems[cartItemIndex]"
  >
    <ErrorProduct v-if="cartItem.errorMsg" :productIndex="cartItemIndex" />
    <figure>
      <LoadImage
        :id="cartDrawerItems[cartItemIndex].images[0].id"
        size="medium"
      />
    </figure>
    <div class="card-content">
      <button
        class="btn btn-remove"
        v-if="!isCheckout"
        @click="removeFromCart()"
      >
        <IconDelete />
      </button>
      <h4 class="mb-0">{{ cartDrawerItems[cartItemIndex].name }}</h4>

      <div class="product-small-details d-flex">
        <div v-if="cartDrawerItems[cartItemIndex].weight">
          {{ cartDrawerItems[cartItemIndex].weight
          }}<span
            v-if="
              cartDrawerItems[cartItemIndex].categories.filter(
                (cat) => cat.slug === 'bauturi'
              ).length > 0
            "
            >ml</span
          ><span v-else>g</span>
        </div>
        <div
          class="price ms-auto"
          v-html="cartDrawerItems[cartItemIndex].price_html"
        ></div>
      </div>

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

      <div v-if="!isCheckout" class="cart-item-actions d-flex">
        <button @click="updateCartItemQty(-1)">-</button>
        <input
          type="number"
          min="0"
          @keyup="updateCartItemQty($event.target.value, true)"
          :value="store.cartData.items[cartItemIndex].productQty"
        />
        <button @click="updateCartItemQty(1)">+</button>
      </div>

      <div
        v-if="cartItem.productExtras.length > 0"
        class="cart-item-extras-actions"
      >
        <div
          class="d-flex"
          v-for="(extra, extraIndex) in cartItem.productExtras"
          :key="extra"
        >
          <button
            v-if="!isCheckout"
            @click="updateCartItemExtraQty(extraIndex, -1)"
          >
            -
          </button>
          <input
            :disabled="isCheckout"
            type="number"
            min="0"
            max="10"
            :value="
              store.cartData.items[cartItemIndex].productExtras[extraIndex]
                .extraQty
            "
            @keyup="
              updateCartItemExtraQty(extraIndex, $event.target.value, true)
            "
            @focusout="
              updateCartItemExtraQty(
                extraIndex,
                $event.target.value,
                true,
                true
              )
            "
          />
          <button
            v-if="!isCheckout"
            @click="updateCartItemExtraQty(extraIndex, 1)"
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-product-cart {
}

figure {
  flex: 0 0 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;

  :deep {
    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.card-content {
  position: relative;
}

.btn-remove {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.product-small-details {
  font-family: $font-family-lanekcut;
  font-size: 2.2rem;
  color: $gray-500;

  .price {
    font-size: 2.4rem;
    color: $body-color;
  }
}
</style>
