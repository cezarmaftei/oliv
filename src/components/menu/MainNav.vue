<script setup>
import VRuntimeTemplate from "vue3-runtime-template";
import MenuProductCategories from "@/components/menu/MenuProductCategories.vue";
import NavbarBrand from "./NavbarBrand.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import NavbarCallUs from "./NavbarCallUs.vue";
import NavbarBtnSearch from "./NavbarBtnSearch.vue";
import NavbarUserMenu from "./NavbarUserMenu.vue";
import NavbarCartIcon from "./NavbarCartIcon.vue";
import IconMenu from "../icons/IconMenu.vue";

defineProps({
  isSingle: Boolean,
});

const route = useRoute();
const store = useOlivStore();

const mainNav = ref(false);

onMounted(() => {
  onscroll = () => {
    if (!mainNav.value.classList.contains("navbar-single")) {
      if (
        window.scrollY > 100 &&
        !mainNav.value.classList.contains("navbar-scrolling-loaded")
      ) {
        mainNav.value.classList.add("navbar-scrolling");
        mainNav.value.classList.remove("navbar-no-scrolling");

        setTimeout(() => {
          mainNav.value.classList.add("navbar-scrolling-loaded");
        }, 300);
      } else if (
        window.scrollY < 50 &&
        mainNav.value.classList.contains("navbar-scrolling-loaded")
      ) {
        mainNav.value.classList.remove("navbar-scrolling");
        mainNav.value.classList.add("navbar-no-scrolling");

        setTimeout(() => {
          mainNav.value.classList.remove("navbar-scrolling-loaded");
        }, 300);
      }
    }
  };
});

const showMenuCart = computed(() => {
  if (route.params.slug && ["finalizare", "cos"].includes(route.params.slug))
    return false;

  return true;
});

const showCategoriesMenu = ref(false);
</script>
<template>
  <nav
    class="main-nav"
    ref="mainNav"
    :class="{
      'navbar-single navbar-scrolling navbar-scrolling-loaded': isSingle,
    }"
  >
    <div class="container">
      <div
        class="navbar-top d-flex justify-content-center align-items-center overflow-hidden bg-light"
      >
        <div class="navbar-brand-wrapper me-auto">
          <NavbarBrand />
        </div>

        <transition name="scale-element">
          <div
            v-if="store.getPageBySlug(route) && store.getPageBySlug(route).acf"
            class="navbar-content-wrapper text-center"
          >
            <div class="px-1">
              <v-runtime-template
                :template="store.getPageBySlug(route).acf.page_header_content"
              ></v-runtime-template>
            </div>
          </div>
        </transition>

        <div class="navbar-features-wrapper d-flex ms-auto">
          <div class="navbar-feature">
            <transition name="scale-element">
              <NavbarCallUs />
            </transition>
          </div>

          <div class="navbar-feature">
            <NavbarBtnSearch />
          </div>

          <div class="navbar-feature navbar-buttons d-flex justify-content-end">
            <transition name="scale-element">
              <NavbarUserMenu />
            </transition>

            <transition name="scale-element">
              <div v-if="showMenuCart" class="navbar-cart-wrapper">
                <NavbarCartIcon />
              </div>
            </transition>
          </div>

          <div class="navbar-feature d-flex align-items-center d-lg-none">
            <button
              class="mobile-categories-filter"
              @click="showCategoriesMenu = !showCategoriesMenu"
              :class="{ active: showCategoriesMenu }"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="navbar-bot">
      <div class="container">
        <div class="menu-product-categories-outer bg-light">
          <div
            class="menu-product-categories-inner"
            :class="{ show: showCategoriesMenu }"
          >
            <div class="secondary-navbar">
              <MenuProductCategories />
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.main-nav-filler,
.navbar-top {
  @include transition($transition-base);
}

.navbar-top {
  position: relative;
  z-index: 1001;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid $border-color;
}

.navbar-features-wrapper {
  align-items: center;
}

.navbar-feature {
  margin: 0 0.5rem;
}

.navbar-cart-wrapper {
  white-space: nowrap;
}

.navbar-content-wrapper {
  flex-grow: 1;
  display: none;
}

.navbar-buttons {
  font-family: $font-family-lanekcut;
  line-height: 0.6;
}

.navbar-bot {
  @include transition($transition-base);
}

.menu-header {
  background: $body-bg;
}

.secondary-navbar {
  @include padding(3rem 0);
}

.navbar-separator {
  flex: 0 0 100%;
  max-width: 100%;
}

.mobile-categories-filter {
  border: 0;
  background: none;
  margin: 0;
  padding: 0;
  width: 2rem;
  height: 2rem;
  fill: $body-color;
  @include transition($transition-base);

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  &.active {
    fill: $olive;
  }
}

.menu-product-categories-inner {
  @include transition($transition-base);
  max-height: 0;
  overflow: hidden;

  &.show {
    max-height: 300px;
  }

  @include media-breakpoint-up(lg) {
    max-height: 300px;
  }
}

@include media-breakpoint-up(xs) {
  .mobile-categories-filter {
    width: 2.2rem;
    height: 2.2rem;
  }
}

@include media-breakpoint-up(sm) {
  .navbar-feature {
    margin: 0 0.8rem;
  }
}

@include media-breakpoint-up(lg) {
  .navbar-top {
    @include global-border;
    @include padding(2rem);
    @include transition($transition-base);
  }

  .secondary-navbar {
    padding: 0;
  }

  .navbar-features-wrapper {
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
  }

  .navbar-feature {
    width: 100%;
    margin: 0.5rem 0;
  }

  .navbar-buttons {
    align-items: center;
  }

  .navbar-cart-wrapper {
    margin-left: 3rem;
  }

  .navbar-content-wrapper {
    display: block;
    position: relative;

    :deep {
      h1 {
        font-size: 13rem;
      }

      p {
        display: block;
        margin-bottom: 0;
      }
    }
  }

  .navbar-scrolling {
    .navbar-top {
      max-height: 100px;
    }

    .navbar-content-wrapper {
      animation: content-scrolling 0.5s linear forwards;
    }

    .navbar-features-wrapper {
      animation: features-scrolling 0.5s linear forwards;
    }
  }

  .navbar-no-scrolling {
    &:not(.navbar-scrolling-loaded) {
      .navbar-top {
        max-height: 600px;
      }
    }

    .navbar-content-wrapper {
      animation: content-no-scrolling 0.5s linear forwards;
    }

    .navbar-features-wrapper {
      animation: features-no-scrolling 0.5s linear forwards;
    }
  }

  .navbar-scrolling-loaded {
    .navbar-top {
      max-height: 100px;
    }

    .navbar-feature {
      margin: 0 1rem;
    }

    .navbar-cart-wrapper {
      margin-left: 2rem;
    }
  }

  @keyframes content-scrolling {
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    50% {
      transform: translateY(-50px);
      opacity: 0;
    }

    100% {
      transform: translateY(-500px);
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  @keyframes content-no-scrolling {
    0% {
      transform: translateY(-500px);
      opacity: 0;
    }

    70% {
      transform: translateY(-50px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes features-scrolling {
    0% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(1000px);
    }

    100% {
      transform: translateX(0);
      flex-direction: row;
      align-items: center;
    }
  }

  @keyframes features-no-scrolling {
    0% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(1000px);
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-around;
    }

    100% {
      transform: translateX(0);
    }
  }
}

@include media-breakpoint-up(xl) {
  .navbar-buttons {
    font-size: 2.4rem;
  }

  .navbar-cart-wrapper {
    margin-left: auto;
    margin-right: 0;
  }

  .navbar-content-wrapper {
    :deep {
      h1 {
        font-size: 17rem;
      }
    }
  }

  .navbar-feature {
    margin: 1rem 0;
  }
}
</style>
