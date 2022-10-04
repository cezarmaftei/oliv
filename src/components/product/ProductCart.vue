<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import ErrorProduct from "@/components/error/ErrorProduct.vue";
import LoadImage from "@/components/partials/LoadImage.vue";
import ItemPrice from "@/components/partials/ItemPrice.vue";
import ProductWeight from "@/components/product/ProductWeight.vue";
import { computed } from "vue";

const store = useOlivStore();
const showExtras = ref(false);

const props = defineProps({
  cartItemIndex: Number,
  cartItem: Object,
  isCheckout: Boolean,
  isOffCanvas: Boolean,
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
  store.cartData.items[props.cartItemIndex].productQty = newValue;
  // store.$patch(
  //   (state) => (state.cartData.items[props.cartItemIndex].productQty = newValue)
  // );
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
  store.cartData.items[props.cartItemIndex].productExtras[extraIndex].extraQty =
    newValue;
  // store.$patch(
  //   (state) =>
  //     (state.cartData.items[props.cartItemIndex].productExtras[
  //       extraIndex
  //     ].extraQty = newValue)
  // );
};

/**
 * Remove product from cart
 */
const removeFromCart = () => {
  // Remove
  store.cartData.items.splice(props.cartItemIndex, 1);
  // store.$patch((state) => {
  //   state.cartData.items.splice(props.cartItemIndex, 1);
  // });
};

/**
 * Item extras count
 */
const itemExtrasCount = computed(() => {
  let extrasCount = 0;
  if (props.cartItem.productExtras.length > 0) {
    props.cartItem.productExtras.forEach((extra) => {
      extrasCount += extra.extraQty;
    });
  }

  return extrasCount;
});
</script>

<template>
  <div class="card card-product-cart" :class="{ 'bg-white': isOffCanvas }">
    <transition name="height-element-sm">
      <ErrorProduct v-if="cartItem.errorMsg" :productIndex="cartItemIndex" />
    </transition>
    <div class="d-flex position-relative">
      <figure>
        <LoadImage :id="cartItem.thumbId" size="medium" />
      </figure>
      <div class="card-content">
        <button
          type="button"
          class="btn btn-delete"
          @click="removeFromCart()"
        ></button>
        <h3 class="mb-0">{{ cartItem.name }}</h3>

        <div class="product-small-details d-flex">
          <ProductWeight :weight="cartItem.productWeight" />
          <ItemPrice class="ms-auto" :price="cartItem.itemTotal" />
        </div>

        <div class="cart-item-actions d-flex align-items-center">
          <div class="quantity-wrap">
            <button type="button" @click="updateCartItemQty(-1)">-</button>
            <input
              type="text"
              @keyup="updateCartItemQty($event.target.value, true)"
              :value="store.cartData.items[cartItemIndex].productQty"
              readonly
            />
            <button type="button" @click="updateCartItemQty(1)">+</button>
          </div>
          <ItemPrice
            class="ms-auto"
            :showX="true"
            :price="cartItem.productPrice"
          />
        </div>

        <button
          type="button"
          class="show-extras mt-1 p-0 border-0 bg-transparent"
          :class="{ 'is-open': showExtras }"
          @click="showExtras = !showExtras"
        >
          <span v-if="itemExtrasCount > 0">
            Editeaza extra
            <strong>({{ itemExtrasCount }})</strong>
          </span>
          <span v-else-if="cartItem.productExtras.length > 0">
            Adauga extra
          </span>
        </button>

        <transition name="height-element-sm">
          <div
            v-show="showExtras"
            v-if="cartItem.productExtras.length > 0"
            class="cart-item-extras-actions"
          >
            <div
              class="extra-wrap d-flex"
              v-for="(extra, extraIndex) in cartItem.productExtras"
              :key="extra"
            >
              <div class="quantity-wrap">
                <button
                  type="button"
                  @click="updateCartItemExtraQty(extraIndex, -1)"
                >
                  -
                </button>
                <input
                  type="text"
                  readonly
                  :value="
                    store.cartData.items[cartItemIndex].productExtras[
                      extraIndex
                    ].extraQty
                  "
                  @keyup="
                    updateCartItemExtraQty(
                      extraIndex,
                      $event.target.value,
                      true
                    )
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
                  type="button"
                  @click="updateCartItemExtraQty(extraIndex, 1)"
                >
                  +
                </button>
              </div>

              <ItemPrice :showX="true" :price="extra.extraPrice" />
              <p class="extra-name m-0">
                {{ extra.extraName }}
              </p>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-product-cart {
  @include padding-bottom(2rem);
  @include margin-bottom(2rem);
  border-bottom: 1px solid $gray-200;
}

h3 {
  font-size: 2.2rem;
  padding-right: 2.5rem;
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

.show-extras {
  font-weight: $font-weight-bold;

  span {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      left: 100%;
      top: 50%;
      margin-top: -0.5rem;
      margin-left: 0.5rem;
      transform: rotate(90deg);
      width: 1rem;
      height: 1rem;
      background: escape-svg(
          url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266.39 209.56"><path d="M266.39,104.78,161.61,0l-20,20.13,70.45,70.44H0V119H212.07l-70.45,70.44,20,20.13L266.39,104.78Z"/></svg>')
        )
        no-repeat center center / 100% auto;
      @include transition($transition-base);
    }
  }

  &.is-open {
    span {
      &:after {
        transform: rotate(-90deg);
      }
    }
  }
}

.card-content {
  position: relative;
  flex-grow: 1;
}

.btn-remove,
.btn-delete {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
}

.product-small-details {
  font-family: $font-family-lanekcut;
  margin-top: 0.5rem;
  font-size: 2.2rem;
  color: $gray-500;
  line-height: 2rem;

  .price {
    font-size: 2.4rem;
    color: $body-color;
  }
}

.cart-item-actions,
.cart-item-extras-actions {
  margin-top: 1rem;

  .price {
    font-weight: $font-weight-bold;
  }
}
.extra-wrap {
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;

  .extra-name {
    flex: 0 0 100%;
    max-width: 100%;
    order: 0;
  }

  .quantity-wrap {
    order: 1;
  }

  .price {
    order: 2;
    margin-left: auto;
  }
}

@include media-breakpoint-up(xs) {
  h3 {
    font-size: 2.6rem;
  }

  figure {
    flex: 0 0 10rem;
    height: 10rem;
  }
}

@include media-breakpoint-up(lg) {
  .cart-page-inner {
    h3 {
      font-size: 3.2rem;
    }

    .product-small-details {
      .price {
        font-size: 3.2rem;
      }
    }
  }
}
</style>
