<script setup>
import VRuntimeTemplate from "vue3-runtime-template";
import MenuProductCategories from "@/components/menu/MenuProductCategories.vue";
import CartQty from "@/components/cart/CartQty.vue";
import NavbarBrand from "@/components/partials/NavbarBrand.vue";
import ItemPrice from "@/components/partials/ItemPrice.vue";
import BtnSearch from "@/components/button/BtnSearch.vue";
import IconCart from "@icons/IconCart.vue";
import IconMenu from "@icons/IconMenu.vue";
import IconLoading from "@icons/IconLoading.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";

const route = useRoute();
const store = useOlivStore();

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

const showMenuCart = computed(() => {
  if (route.params.slug && ["finalizare", "cos"].includes(route.params.slug))
    return false;

  return true;
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
      <div
        class="navbar-top d-flex justify-content-end align-items-center overflow-hidden"
      >
        <div class="navbar-brand-wrapper me-auto">
          <NavbarBrand />
        </div>

        <transition name="scale-element">
          <div
            v-if="!isClone && store.getPageBySlug(route).acf"
            class="navbar-content-wrapper text-center d-none d-md-block"
          >
            <v-runtime-template
              :template="store.getPageBySlug(route).acf.page_header_content"
            ></v-runtime-template>
          </div>
        </transition>

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

          <BtnSearch class="d-none d-xl-inline-block" />

          <div class="navbar-buttons d-flex justify-content-end">
            <div
              v-if="store.isLoaded"
              class="navbar-account d-none d-xl-block me-auto"
            >
              <div v-if="store.userData.loggedIn" class="logged-in">
                <router-link to="/contul-meu">Contul Meu</router-link>
              </div>
              <div v-else>
                <a data-bs-toggle="modal" href="#login-modal" role="button"
                  >Contul Meu</a
                >
              </div>
            </div>
            <div v-if="showMenuCart" class="navbar-cart-wrapper">
              <transition name="scale-element">
                <button
                  v-if="store.isLoaded"
                  class="btn navbar-cart d-flex align-items-center text-center"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#cart-drawer"
                  aria-controls="cart-drawer"
                  @click="store.mergeCartProducts"
                >
                  <span class="cart-icon">
                    <IconCart />
                    <CartQty
                      class="d-flex align-items-center justify-content-center"
                    />
                  </span>

                  <span class="navbar-total-price">
                    <ItemPrice
                      v-if="store.cartData.totalPrice"
                      :price="store.cartData.totalPrice"
                    />
                    <ItemPrice v-else :price="0" />
                  </span>
                </button>
                <button class="btn navbar-cart" v-else><IconLoading /></button>
              </transition>
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
            <a data-bs-toggle="modal" href="#login-modal" role="button"
              >Contul Meu</a
            >
          </div>
        </div>
        <BtnSearch />
      </div>
    </div>
    <div class="navbar-bot">
      <div class="container">
        <div class="secondary-navbar">
          <MenuProductCategories />
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.main-nav {
  &.cloned {
    transform: translateY(-100%);
    @include transition(transform 0.2s linear);

    &.scrolling {
      transform: translateY(0);
    }
  }
}

.navbar-top,
.secondary-navbar {
  background: $body-bg;
}
.navbar-top {
  position: relative;
  z-index: 1001;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid $border-color;
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
}
.mobile-menu-trigger {
  padding: 0;
  width: 2.5rem;
}

.navbar-cart-wrapper {
  margin-right: 0.5rem;
  white-space: nowrap;
}

.navbar-cart {
  .cart-icon {
    position: relative;
    padding: 0;
    margin-right: 0.5rem;
  }

  .cart-qty {
    border-radius: 50%;
    background: $olive;
    color: $white;
    font-size: 1.3rem;
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
}

.navbar-total-price {
  font-size: 2rem;
}

.menu-header {
  background: $body-bg;
}

.scrolling {
  .navbar-bot {
    padding: 0;
  }

  .secondary-navbar {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

@include media-breakpoint-up(sm) {
  .scrolling {
    .navbar-call-us {
      display: flex;
      align-items: center;
      margin: 0;
      margin-right: 3rem;

      span {
        margin-left: 1.5rem;
      }
    }
  }
}

@include media-breakpoint-between(sm, md) {
  .navbar-call-us {
    font-size: 2.2rem;

    span {
      font-size: 2.8rem;
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
    margin-right: auto;
  }

  .navbar-cart {
    padding: 0;
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
    }

    .secondary-navbar {
      padding: 0;
    }

    .navbar-content-wrapper {
      display: none !important;
    }

    .navbar-features-wrapper {
      flex-direction: row;
    }

    .navbar-call-us {
      font-size: 2.4rem;
    }

    .mobile-menu-trigger {
      margin-left: 3rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  .navbar-call-us {
    margin-bottom: 2rem;
    font-size: 2.2rem;

    span {
      font-size: 2.8rem;
    }
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
  }
}

@include media-breakpoint-up(xl) {
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
    .navbar-buttons {
      margin-top: 0;
      margin-left: 3rem;
    }

    .navbar-cart-wrapper {
      margin-left: 3rem;
    }
  }
}
</style>
