<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import IconCart from "@icons/IconCart.vue";
import { ref } from "vue";

const store = useOlivStore();

const productExtras = ref([]);
const firstProductAdd = ref([]);
const showProductExtras = ref([]);

defineProps({
  product: Object,
  productCount: Number,
});
</script>

<template>
  <div class="card card-product-listing">
    <h3>{{ product.name }}</h3>
    <figure>
      <img :src="product.images[0].src" />
    </figure>
    <div class="product-description">
      <span v-html="product.description"></span>
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
    </div>
    <div
      class="product-extras collapse"
      :ref="(el) => (showProductExtras[productCount] = el)"
    >
      <div
        class="product-extra d-flex"
        v-for="productExtra in store.getProductExtras(product)"
        :key="productExtra"
      >
        <button
          @click="
            store.handleExtra(
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

              productExtras[product.id][productExtra._id] = el;
            }
          "
          value="0"
          @keyup="
            store.handleExtra(
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
            store.handleExtra(
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
      <span class="price" v-html="product.price_html"></span>
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
