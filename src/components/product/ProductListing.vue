<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import IconCart from "@icons/IconCart.vue";
import LoadImage from "@/components/partials/LoadImage.vue";
import { ref } from "vue";

const props = defineProps({
  product: Object,
  productCount: Number,
  isSingle: Boolean,
});

const store = useOlivStore();
const productPrice = ref(parseFloat(props.product.price));
const productFullPrice = ref(parseFloat(props.product.regular_price));
const productExtras = ref([]);
const firstProductAdd = ref([]);
const showProductExtras = ref([]);

/**
 * Update extra quantity in cart and update product price
 * @param {String} action
 * @param {DOMElement} element
 * @param {Object} product
 * @param {Object} productExtra
 * @param {Boolean} isFirstTime
 */
const updateProductExtra = (
  action,
  element,
  product,
  productExtra,
  isFirstTime
) => {
  store.handleExtra(action, element, product, productExtra, isFirstTime);

  // Update product price
  let newProductPrice = parseFloat(props.product.price);
  let newProductFullPrice = parseFloat(props.product.regular_price);
  const currentProductExtras = productExtras.value[product.id];
  if (currentProductExtras) {
    for (const [extraId, extraData] of Object.entries(currentProductExtras)) {
      newProductPrice += extraData.element.value * extraData.price;
      newProductFullPrice += extraData.element.value * extraData.price;
    }
  }
  productPrice.value = newProductPrice;
  productFullPrice.value = newProductFullPrice;
};
</script>

<template>
  <div class="card card-product-listing">
    <h2>
      <span v-if="isSingle">
        {{ product.name }}
      </span>
      <router-link v-else :to="`/meniu/${product.slug}`">{{
        product.name
      }}</router-link>
    </h2>
    <figure class="d-flex align-items-center justify-content-center">
      <LoadImage v-if="isSingle" :id="product.images[0].id" size="medium" />
      <router-link v-else :to="`/meniu/${product.slug}`"
        ><LoadImage :id="product.images[0].id" size="medium"
      /></router-link>
    </figure>
    <div class="product-description">
      <div v-html="product.description"></div>
      <strong
        class="product-weight d-none d-sm-inline-block"
        v-if="product.weight"
      >
        {{ product.weight
        }}<span
          v-if="
            product.categories.filter((cat) => cat.slug === 'bauturi').length >
            0
          "
          >ml</span
        ><span v-else>g</span>
      </strong>
      <div v-if="isSingle" v-html="product.short_description"></div>
    </div>
    <!-- <div
      class="product-extras"
      :class="!isSingle ? 'collapse' : ''"
      :ref="(el) => (showProductExtras[productCount] = el)"
    >
      <div
        class="product-extra d-flex"
        v-for="productExtra in store.getProductExtras(product)"
        :key="productExtra"
      >
        <button
          @click="
            updateProductExtra(
              'sub',
              productExtras[product.id][productExtra._id],
              product,
              productExtra,
              true
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
              if (!productExtras[product.id]) productExtras[product.id] = {};

              productExtras[product.id][productExtra._id] = {
                element: el,
                price: productExtra._price,
              };
            }
          "
          value="0"
          @keyup="
            updateProductExtra(
              'update',
              productExtras[product.id][productExtra._id],
              product,
              productExtra,
              true
            )
          "
        />
        <button
          @click="
            updateProductExtra(
              'add',
              productExtras[product.id][productExtra._id],
              product,
              productExtra,
              true
            )
          "
        >
          +
        </button>
        <div class="extra-name">
          {{ productExtra._name }}<br />
          <strong>{{ productExtra._price }}</strong> lei
        </div>
      </div>
    </div> -->
    <div class="product-actions d-flex align-items-center">
      <div class="product-weight d-sm-none" v-if="product.weight">
        {{ product.weight
        }}<span
          v-if="
            product.categories.filter((cat) => cat.slug === 'bauturi').length >
            0
          "
          >ml</span
        ><span v-else>g</span>
      </div>
      <span class="price">{{ productPrice }} lei</span>
      <button
        :ref="
          () => {
            firstProductAdd[product.id] = true;
          }
        "
        @click="
          // Add to cart
          store.addToCart(
            product,
            productExtras[product.id],
            1,
            firstProductAdd[product.id]
          );
          // Show extras
          if (showProductExtras[productCount])
            showProductExtras[productCount].classList.add('show');
          // Change to false to disable future updates on extras
          firstProductAdd[product.id] = false;
        "
      >
        adauga in cos
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-product-listing {
  background: $white;
  position: relative;
  padding: 1rem 0 0 8rem;

  h2 {
    a {
      color: $body-color;
    }
  }

  figure {
    position: absolute;
    left: 0;
    top: 0;
    width: 8rem;
    height: 8rem;

    :deep {
      img,
      svg {
        display: block;
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }

  .product-actions {
    font-family: $font-family-lanekcut;
    line-height: 1.2;
    font-size: 2rem;

    > * {
      padding: 0 0.5rem;
      flex-grow: 1;
      text-align: center;
    }

    .product-weight {
      padding-left: 0;
      text-align: left;
      color: $gray-500;
    }

    .price {
      border-top: 2px solid $border-color;
      border-left: 2px solid $border-color;
    }

    button {
      margin: 0;
      background: none;
      border: 0;
      border-top: 2px solid $border-color;
      background: $yellow-200;
    }
  }

  @include media-breakpoint-up(xs) {
    padding-left: 12rem;

    figure {
      width: 12rem;
      height: 12rem;

      :deep {
        img,
        svg {
          width: 10rem;
          height: 10rem;
        }
      }
    }

    .product-actions {
      font-size: 2.2rem;
    }
  }

  @include media-breakpoint-up(sm) {
    @include padding(3rem 3rem 10rem);
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    figure {
      position: static;
      margin: auto;
      width: 100%;
      height: 19rem;
      @include margin-top(3rem);
      @include margin-bottom(3rem);

      a {
        display: block;
        height: 100%;
      }

      :deep {
        svg,
        img {
          border-radius: 0;
          width: 100%;
          height: 100%;
        }
      }
    }

    .product-actions {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;

      > * {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }

      .price {
        border-left: 0;
      }

      button {
        border-left: 2px solid $border-color;
        background: transparent;

        &:hover {
          background: $yellow-200;
          border-left-color: $yellow-200;
        }
      }
    }
  }
}
</style>
