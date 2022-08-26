<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";
import FormLogin from "@/components/partials/FormLogin.vue";
import MenuProductCategories from "@/components/partials/MenuProductCategories.vue";
import MenuUserAccount from "@/components/partials/MenuUserAccount.vue";
import CartContent from "@/components/partials/CartContent.vue";
import LogoOliv from "@icons/LogoOliv.vue";
import SplashGreen from "@icons/SplashGreen.vue";
import IconCart from "@icons/IconCart.vue";

const store = useOlivStore();
const route = useRoute();

const showLoginForm = ref(false);

// This doesn't work on page load so I had to use computed()
const currentPage = computed(() => store.getPageBySlug(route.params.slug));
</script>

<template>
  <header class="menu-header container">
    <nav>
      <div class="navbar-top d-flex">
        <div class="navbar-brand-wrapper">
          <SplashGreen />
          <router-link class="navbar-brand" to="/">
            <LogoOliv />
          </router-link>
        </div>
        <div class="navbar-content-wrapper">
          <v-runtime-template
            v-if="currentPage"
            :template="currentPage.metadata.page_header_content[0]"
          ></v-runtime-template>
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
            <input type="search" name="q" placeholder="search here..." />
          </div>

          <div v-if="store.userData.success" class="logged-in">
            <router-link to="/contul-meu">Contul Meu</router-link>
          </div>

          <div v-else>
            <button @click="showLoginForm = !showLoginForm">Login</button>

            <div class="login-form" v-show="showLoginForm">
              <p>Introdu numele de utilizator si parola:</p>
              <FormLogin />
            </div>
          </div>

          <button
            v-if="route.params.slug !== 'finalizare'"
            class="navbar-cart"
            @click="store.showCartDrawerAction"
          >
            <IconCart />
            <span v-if="store.cartData.totalQty > 0">{{
              store.cartData.totalQty
            }}</span>
          </button>
        </div>
      </div>
      <div v-if="route.params.slug === 'meniu'" class="navbar-bot">
        <MenuProductCategories />
      </div>
      <div v-if="route.params.slug === 'contul-meu'" class="navbar-bot">
        <MenuUserAccount />
      </div>
    </nav>
    <div class="cart-drawer bg-light p-5" v-show="store.showCartDrawer">
      <CartContent />
    </div>
  </header>
</template>

<style scoped lang="scss">
svg,
img {
  display: block;
  width: 50px;
}
</style>
