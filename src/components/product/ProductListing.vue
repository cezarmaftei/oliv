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
    <h3>
      <span v-if="isSingle">
        {{ product.name }}
      </span>
      <router-link v-else :to="`/meniu/${product.slug}`">{{
        product.name
      }}</router-link>
    </h3>
    <figure>
      <LoadImage v-if="isSingle" :id="product.images[0].id" size="medium" />
      <router-link v-else :to="`/meniu/${product.slug}`"
        ><LoadImage :id="product.images[0].id" size="medium"
      /></router-link>
    </figure>
    <div class="product-description">
      <div v-html="product.description"></div>
      <strong v-if="product.weight"
        >{{ product.weight
        }}<span
          v-if="
            product.categories.filter((cat) => cat.slug === 'bauturi').length >
            0
          "
          >ml</span
        ><span v-else>g</span></strong
      >

      <div v-if="isSingle" v-html="product.short_description"></div>
    </div>
    <div
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
    </div>
    <div class="product-actions">
      <del class="d-block" v-if="product.sale_price"
        >{{ productFullPrice }} lei</del
      >
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
        <IconCart />
        adauga in cos
      </button>
    </div>
  </div>
</template>
