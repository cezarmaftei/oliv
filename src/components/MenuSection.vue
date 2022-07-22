<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import LogoOliv from "@icons/LogoOliv.vue";
import SplashGreen from "@icons/SplashGreen.vue";
import IconCart from "@icons/IconCart.vue";

const store = useOlivStore();
const getProductsByCategory = (products, catID) => {
  return products.filter((product) =>
    product.categories.every((cat) => cat.id === catID)
  );
};
</script>

<template>
  <header class="menu-header">
    <nav>
      <div class="navbar-top">
        <div class="navbar-brand-wrapper">
          <SplashGreen />
          <router-link class="navbar-brand" to="/">
            <LogoOliv />
          </router-link>
        </div>
        <div class="navbar-content-wrapper">
          <h1>Meniul Oliv</h1>
          <p>
            Preparate echilibrate nutritional si gatite cu dragoste in bucataria
            noastra
          </p>
        </div>
        <div class="navbar-features-wrapper">
          <a
            v-if="store.websiteOptions.global_settings"
            class="call-us"
            :href="`tel:${store.websiteOptions.global_settings.phone_number}`"
          >
            CONTACTEAZA-ne
            <span>{{
              store.websiteOptions.global_settings.phone_number
            }}</span></a
          >
          <div class="navbar-search">
            <input type="search" name="q" />
          </div>
          <div class="navbar-my-account">Contul Meu</div>

          <div class="navbar-cart">
            <IconCart />
            <span>0.00 RON</span>
          </div>
        </div>
      </div>
      <div class="navbar-bot">
        <ul>
          <li v-for="cat in store.storeData.categories" :key="cat">
            <button>
              {{ cat.name }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </header>
  <div v-for="cat in store.storeData.categories" :key="cat">
    <div v-if="store.storeData.products">
      <div
        class="card card-product"
        v-for="product in getProductsByCategory(
          store.storeData.products,
          cat.term_id
        )"
        :key="product.id"
      >
        <h3>{{ product.name }}</h3>
        <figure>
          <img :src="product.images[0].src" />
        </figure>
        <div class="product-description" v-html="product.description"></div>
        <div class="product-actions">
          <span class="price" v-html="product.price_html"></span>
          <button>
            <IconCart />
            adauga in cos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
