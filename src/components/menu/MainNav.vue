<script setup>
import VRuntimeTemplate from "vue3-runtime-template";
import FormLogin from "@/components/form/FormLogin.vue";
import MenuProductCategories from "@/components/menu/MenuProductCategories.vue";
import MenuUserAccount from "@/components/menu/MenuUserAccount.vue";
import FormSearch from "@/components/form/FormSearch.vue";
import LogoOliv from "@icons/LogoOliv.vue";
import SplashGreen from "@icons/SplashGreen.vue";
import IconCart from "@icons/IconCart.vue";
import IconMenu from "@icons/IconMenu.vue";
import IconLoading from "@icons/IconLoading.vue";
import { inject, onMounted, onBeforeUnmount, ref } from "vue";
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";

const route = useRoute();
const store = useOlivStore();

const showMenuProductCats = inject("showMenuProductCats");

const showLoginForm = ref(false);
const showMobileMenu = ref(false);

const mainNav = ref(false);
const scrollingClass = ref(false);

const props = defineProps({
  isClone: Boolean,
  isSingle: Boolean,
});

onMounted(() => {
  if (props.isClone) {
    onscroll = () => {
      if (mainNav.value && window.scrollY > mainNav.value.clientHeight / 2) {
        scrollingClass.value = true;
      } else {
        scrollingClass.value = false;
      }
    };
  }
});
</script>
<template>
  <nav
    class="main-nav"
    ref="mainNav"
    :class="{
      scrolling: scrollingClass || props.isSingle,
      cloned: isClone,
      'fixed-top': isClone,
    }"
  >
    <div class="container">
      <div class="navbar-top d-flex justify-content-end align-items-center">
        <div class="navbar-brand-wrapper me-auto">
          <router-link class="navbar-brand d-flex align-items-end" to="/">
            <SplashGreen />
            <LogoOliv />
          </router-link>
        </div>
        <div
          v-if="!isClone"
          class="navbar-content-wrapper text-center d-none d-md-block"
        >
          <v-runtime-template
            v-if="
              store.currentPage &&
              store.currentPage.acf &&
              store.currentPage.acf.page_header_content
            "
            :template="store.currentPage.acf.page_header_content"
          ></v-runtime-template>
        </div>
        <div class="navbar-features-wrapper d-flex align-items-center ms-auto">
          <a
            v-if="store.websiteOptions.global_settings"
            class="navbar-call-us text-end"
            :href="`tel:${store.websiteOptions.global_settings.phone_number}`"
          >
            Contacteaza-ne
            <span>{{
              store.websiteOptions.global_settings.phone_number
            }}</span></a
          >

          <FormSearch class="d-none d-xl-block" />

          <div class="navbar-buttons d-flex justify-content-end">
            <div
              v-if="store.isLoaded"
              class="navbar-account d-none d-xl-block me-auto"
            >
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

            <div class="navbar-cart-wrapper text-center">
              <button
                v-if="store.isLoaded && route.params.slug !== 'finalizare'"
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
              <button class="btn navbar-cart" v-else><IconLoading /></button>
              <div
                v-if="store.isLoaded && store.cartData.totalPrice"
                class="navbar-total-price"
              >
                {{ store.cartData.totalPrice }} lei
              </div>
            </div>

            <button
              class="btn mobile-menu-trigger d-xl-none"
              @click="showMobileMenu = !showMobileMenu"
            >
              <IconMenu />
            </button>
          </div>
        </div>
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
    <div
      v-if="showMenuProductCats || route.params.slug === 'contul-meu'"
      class="navbar-bot"
    >
      <div class="container">
        <div class="secondary-navbar">
          <MenuProductCategories v-if="showMenuProductCats" />
          <MenuUserAccount v-if="route.params.slug === 'contul-meu'" />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.main-nav {
  &.scrolling {
    background: $body-bg;
  }
  &.cloned {
    transform: translateY(-100%);
    @include transition($transition-base);
    background: $body-bg;

    &.scrolling {
      transform: translateY(0);
    }
  }
}
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
  line-height: 0.7;
  font-family: $font-family-lanekcut;
  font-size: 1.8rem;
  color: $gray-500;

  span {
    display: block;
    font-size: 2.3rem;
    color: $body-color;
  }

  @include media-breakpoint-between(sm, md) {
    font-size: 2.2rem;

    span {
      font-size: 2.8rem;
    }
  }

  @include media-breakpoint-up(lg) {
    font-size: 2.2rem;

    span {
      font-size: 2.8rem;
    }
  }
}
.mobile-menu-trigger {
  padding: 0;
  width: 2.5rem;

  :deep {
    svg {
      max-width: 100%;
    }
  }
}

.navbar-cart-wrapper {
  margin-right: 1rem;
}

.navbar-cart {
  position: relative;
  padding: 0;

  span {
    border-radius: 50%;
    background: $orange;
    color: $white;
    font-size: 1.3rem;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    right: -0.5rem;
    top: -0.75rem;
  }

  :deep {
    svg {
      display: block;
      width: 2.2rem;
      height: 2.2rem;
    }
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

.navbar-content-wrapper {
  flex-grow: 1;
}

.navbar-buttons {
  font-family: $font-family-lanekcut;
  line-height: 0.6;
}

.navbar-bot {
  @include padding(3rem 0);
  @include transition($transition-base);

  :deep {
    h3 {
      overflow: hidden;
      @include transition($transition-base);
      max-height: 100px;
    }
  }
}

.navbar-total-price {
  font-size: 2rem;
}

.menu-header {
  background: $body-bg;
}

.scrolling {
  .navbar-bot {
    padding-top: 1rem;
    padding-bottom: 1rem;

    :deep {
      h3 {
        max-height: 0;
        margin: 0 !important;
      }

      .btn-outline-dark {
        padding: 0.3rem 0.5rem;
      }
    }
  }
}

@include media-breakpoint-up(xs) {
  .scrolling {
    .navbar-bot {
      :deep {
        .btn-outline-dark {
          padding: 0.3rem 0.7rem;
        }
      }
    }
  }
}

@include media-breakpoint-up(sm) {
  .scrolling {
    .navbar-bot {
      :deep {
        .btn-outline-dark {
          padding: 0.7rem 1.2rem;
        }
      }
    }
  }
}

@include media-breakpoint-up(md) {
  .navbar-top {
    border: 2px solid $border-color;
    @include padding(2rem);
  }

  .navbar-bot {
    padding: 0;
  }
  .navbar-brand {
    width: 12rem;
  }
  .navbar-call-us {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  .navbar-features-wrapper {
    flex-direction: column;
  }

  .navbar-buttons {
    width: 100%;
  }

  .navbar-cart-wrapper {
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-right: auto;
  }

  .mobile-menu-trigger {
    margin-left: 0.5rem;
  }

  .navbar-content-wrapper {
    padding: 0 1rem;

    :deep {
      h1 {
        font-size: 11rem;
      }

      p {
        display: none;
      }
    }
  }

  .scrolling {
    .navbar-top {
      padding-left: 0;
      overflow: hidden;
    }
    .navbar-brand {
      width: 10rem;
      margin: -2.5rem 0 0 -2rem;
    }
    .navbar-content-wrapper {
      display: none !important;
    }

    .navbar-features-wrapper {
      flex-direction: row;
    }

    .navbar-call-us {
      display: flex;
      align-items: center;
      font-size: 2.4rem;
      margin: 0;
      margin-right: 3rem;

      span {
        margin-left: 1.5rem;
      }
    }

    .mobile-menu-trigger {
      margin-left: 3rem;
    }
    .navbar-bot {
      padding: 0;
      :deep {
        .btn-outline-dark {
          padding: 0.5rem 1rem;
        }
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .navbar-brand {
    width: 15rem;
  }

  .navbar-call-us {
    margin-bottom: 2rem;
  }

  .navbar-cart {
    margin-right: 0.5rem;
  }

  .navbar-content-wrapper {
    :deep {
      h1 {
        font-size: 13rem;
      }

      p {
        display: block;
      }
    }
  }

  .scrolling {
    .navbar-call-us {
      font-size: 2.8rem;
    }

    .navbar-brand {
      width: 12rem;
    }

    .navbar-bot {
      padding: 0;
      :deep {
        .btn-outline-dark {
          padding: 1.2rem 1rem;
        }
      }
    }
  }
}

@include media-breakpoint-up(xl) {
  :deep {
    .search-wrapper {
      max-width: 225px;
    }
  }
  .navbar-call-us {
    display: flex;
    justify-content: flex-end;
    font-size: 2.4rem;
    @include margin-bottom(2rem);

    span {
      font-size: 2.4rem;
      margin-left: 1.5rem;
    }
  }

  .navbar-buttons {
    font-size: 2.4rem;
    align-items: center;
    @include margin-top(2rem);

    a {
      margin-left: auto;
      color: $body-color;
    }
  }

  .navbar-cart-wrapper {
    margin-left: auto;
    margin-right: 0;
  }

  .navbar-total-price {
    font-size: 2.4rem;
  }

  .navbar-content-wrapper {
    :deep {
      h1 {
        font-size: 17rem;
      }
    }
  }

  .scrolling {
    .navbar-brand {
      width: 14rem;
      margin: -4rem 0 0 -2rem;
    }
    .navbar-buttons {
      margin-top: 0;
      margin-left: 3rem;
    }

    .navbar-cart-wrapper {
      margin-left: 3rem;
    }

    :deep {
      .search-wrapper {
        min-width: 225px;
      }
    }
  }
}

@include media-breakpoint-up(xxl) {
  .navbar-brand {
    width: 21rem;
  }
}
</style>
