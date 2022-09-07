<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import { ref, inject } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";
import FormLogin from "@/components/form/FormLogin.vue";
import MenuProductCategories from "@/components/partials/MenuProductCategories.vue";
import MenuUserAccount from "@/components/partials/MenuUserAccount.vue";
import CartContent from "@/components/partials/CartContent.vue";
import FormSearch from "@/components/form/FormSearch.vue";
import LogoOliv from "@icons/LogoOliv.vue";
import SplashGreen from "@icons/SplashGreen.vue";
import IconCart from "@icons/IconCart.vue";
import IconMenu from "@icons/IconMenu.vue";

const store = useOlivStore();
const route = useRoute();

const showMenuProductCats = inject("showMenuProductCats");

const showLoginForm = ref(false);
const showMobileMenu = ref(false);
</script>

<template>
  <header class="menu-header">
    <nav class="main-nav">
      <div
        class="navbar-top container d-flex justify-content-end align-items-center"
      >
        <div class="navbar-brand-wrapper me-auto">
          <router-link class="navbar-brand d-flex align-items-end" to="/">
            <SplashGreen />
            <LogoOliv />
          </router-link>
        </div>
        <div class="navbar-content-wrapper d-none d-md-block">
          <v-runtime-template
            v-if="
              store.currentPage &&
              store.currentPage.acf &&
              store.currentPage.acf.page_header_content
            "
            :template="store.currentPage.acf.page_header_content"
          ></v-runtime-template>
        </div>
        <div class="navbar-features-wrapper d-flex">
          <a
            v-if="store.websiteOptions.global_settings"
            class="navbar-call-us"
            :href="`tel:${store.websiteOptions.global_settings.phone_number}`"
          >
            Contacteaza-ne
            <span>{{
              store.websiteOptions.global_settings.phone_number
            }}</span></a
          >

          <FormSearch class="d-none d-md-block" />

          <div v-if="store.isLoaded" class="navbar-account d-none d-md-block">
            <div v-if="store.userData.loggedIn" class="logged-in">
              <router-link to="/contul-meu">Contul Meu</router-link>
            </div>
            <div v-else>
              <button @click="showLoginForm = !showLoginForm">Login</button>
              <div class="login-form" v-show="showLoginForm">
                <p>Introdu numele de utilizator si parola:</p>
                <FormLogin />
              </div>
            </div>
          </div>

          <button
            v-if="route.params.slug !== 'finalizare'"
            class="btn navbar-cart"
            @click="store.showCartDrawerAction"
          >
            <IconCart />
            <span
              class="d-flex align-items-center justify-content-center"
              v-if="store.cartData.totalQty > 0"
              >{{ store.cartData.totalQty }}</span
            >
          </button>

          <button
            class="btn mobile-menu-trigger"
            @click="showMobileMenu = !showMobileMenu"
          >
            <IconMenu />
          </button>
        </div>
      </div>
      <div
        :class="showMobileMenu ? 'show' : 'hide'"
        class="mobile-menu overflow-hidden"
      >
        <div class="mobile-menu-inner container pb-5">
          <div v-if="store.isLoaded" class="navbar-account">
            <div v-if="store.userData.loggedIn" class="logged-in">
              <router-link to="/contul-meu">Contul Meu</router-link>
            </div>
            <div v-else>
              <button @click="showLoginForm = !showLoginForm">Login</button>
              <div class="login-form" v-show="showLoginForm">
                <p>Introdu numele de utilizator si parola:</p>
                <FormLogin />
              </div>
            </div>
          </div>
          <FormSearch />
        </div>
      </div>
      <div v-if="showMenuProductCats" class="navbar-bot">
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
.navbar-top {
  position: relative;
  z-index: 1001;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid $border-color;
}

.navbar-brand {
  width: 7rem;

  :deep {
    svg {
      flex: 1 0 60%;

      &:last-child {
        margin-left: -20%;
        margin-bottom: 1rem;
      }
    }
  }
}

.navbar-call-us {
  margin-right: 1rem;
  white-space: nowrap;
  font-family: $font-family-lanekcut;
  line-height: 0.7;
  @include font-size(2.2rem);
  color: $gray-500;

  span {
    display: block;
    @include font-size(3rem);
    color: $body-color;
  }
}

.navbar-cart,
.mobile-menu-trigger {
  padding: 0;
  width: 2.5rem;

  :deep {
    svg {
      max-width: 100%;
    }
  }
}

.navbar-cart {
  position: relative;
  margin-right: 1rem;

  span {
    border-radius: 50%;
    background: $orange;
    color: $white;
    font-size: 1rem;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    right: -0.5rem;
    top: -0.75rem;
  }
}

.mobile-menu {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  @include transition($transition-base);
  &.hide {
    height: 0;
  }

  &.show {
    height: 100vh;
  }

  .mobile-menu-inner {
    height: 100%;
    background: $gray-200;
    @include padding-top(25rem);
  }
}
</style>
