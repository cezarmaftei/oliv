<script setup>
import VRuntimeTemplate from "vue3-runtime-template";
import MenuProductCategories from "@/components/menu/MenuProductCategories.vue";
import NavbarBrand from "./NavbarBrand.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import NavbarCallUs from "./NavbarCallUs.vue";
import NavbarBtnSearch from "./NavbarBtnSearch.vue";
import NavbarUserMenu from "./NavbarUserMenu.vue";
import NavbarCartIcon from "./NavbarCartIcon.vue";

const route = useRoute();
const store = useOlivStore();

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
      scrolling: scrollingClass || isSingle,
      cloned: isClone || isSingle,
      'fixed-top': isClone,
      'sticky-top': isSingle,
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
            v-if="
              !isClone &&
              store.getPageBySlug(route) &&
              store.getPageBySlug(route).acf
            "
            class="navbar-content-wrapper text-center d-none d-lg-block"
          >
            <v-runtime-template
              :template="store.getPageBySlug(route).acf.page_header_content"
            ></v-runtime-template>
          </div>
        </transition>

        <div class="navbar-features-wrapper d-flex ms-auto">
          <transition name="scale-element">
            <NavbarCallUs />
          </transition>

          <NavbarBtnSearch />

          <div class="navbar-buttons d-flex justify-content-end">
            <transition name="scale-element">
              <NavbarUserMenu />
            </transition>

            <div v-if="showMenuCart" class="navbar-cart-wrapper">
              <transition name="scale-element">
                <NavbarCartIcon />
              </transition>
            </div>
          </div>
        </div>
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
    transform: translateY(-105%);
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

.navbar-features-wrapper {
  align-items: center;
}

.navbar-cart-wrapper {
  white-space: nowrap;
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

.navbar-separator {
  flex: 0 0 100%;
  max-width: 100%;
}

@include media-breakpoint-up(lg) {
  .navbar-top {
    @include global-border;
    @include padding(2rem);
  }

  .navbar-bot {
    padding: 0;
  }

  .navbar-features-wrapper {
    flex-direction: column;
    align-items: flex-end;
  }

  .navbar-buttons {
    align-items: center;
    width: 100%;
  }

  .navbar-cart-wrapper {
    margin-left: auto;
  }

  .navbar-content-wrapper {
    padding: 0 1rem;

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

  .cloned {
    // .navbar-top {
    //   padding-left: 0;
    // }

    .secondary-navbar {
      padding: 0;
    }

    .navbar-content-wrapper {
      display: none !important;
    }

    .navbar-features-wrapper {
      flex-direction: row;
      align-items: center;
    }
  }
}

@include media-breakpoint-up(xl) {
  .navbar-buttons {
    font-size: 2.4rem;
    align-items: center;
    @include margin-top(2rem);
    width: 100%;
    justify-content: flex-start;

    *:last-child {
      margin-left: auto;
      margin-right: 0;
    }
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

  .cloned {
    .navbar-buttons {
      margin-top: 0;
      width: auto;
    }
  }
}
</style>
