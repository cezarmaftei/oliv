<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject, ref } from "vue";
import ErrorProduct from "@/components/partials/ErrorProduct.vue";
import LoadImage from "@/components/partials/LoadImage.vue";
import IconDelete from "@/components/icons/IconDelete.vue";

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
        @click="store.removeFromCart(cartItemIndex)"
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
        <div
          class="d-flex"
          v-for="extra in cartItem.productExtras"
          :key="extra"
        >
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
