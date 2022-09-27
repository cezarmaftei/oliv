<script setup>
import { useRoute, useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { inject, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const store = useOlivStore();

const showUserMenuItems = inject("showUserMenuItems");

/**
 * Show account section based on URL parameter
 * @param {String} itemName
 */
const updateVisibleItem = (itemName) => {
  for (const menuItem in showUserMenuItems.value) {
    showUserMenuItems.value[menuItem].show =
      menuItem === itemName ? true : false;

    if (menuItem === itemName) {
      showUserMenuItems.value[menuItem].show = true;
      if (!router.query) {
        router.push({
          query: {
            show: menuItem,
          },
        });
      } else {
        router.query.show = menuItem;
      }
    } else {
      showUserMenuItems.value[menuItem].show = false;
    }
  }
};

onMounted(() => {
  if (route.query.show) {
    updateVisibleItem(route.query.show);
  } else if (!route.query.action) {
    // Default
    router.push({
      query: {
        show: "orders",
      },
    });
  }
});
</script>

<template>
  <div
    class="row row-categories justify-content-center g-50"
    v-if="store.userData.loggedIn"
  >
    <div
      class="col-auto flex-grow-1"
      v-for="(menuItem, menuItemName) in showUserMenuItems"
      :key="menuItemName"
    >
      <button
        class="btn btn-outline-dark"
        @click="updateVisibleItem(menuItemName)"
      >
        {{ menuItem.title }}
      </button>
    </div>
    <div class="col-auto flex-grow-1">
      <button class="btn btn-outline-dark" @click="store.userActions('logout')">
        Logout
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navbar-bot {
  h3 {
    overflow: hidden;
    @include transition($transition-base);
    max-height: 100px;
  }

  .btn-outline-dark {
    width: 100%;
  }
}

.scrolling {
  .navbar-bot {
    h3 {
      max-height: 0;
      margin: 0 !important;
    }

    .btn-outline-dark {
      padding: 0.3rem 0.5rem;
      width: 100%;
    }
  }
}

@include media-breakpoint-up(xs) {
  .scrolling {
    .navbar-bot {
      .btn-outline-dark {
        padding: 0.3rem 0.7rem;
      }
    }
  }
}

@include media-breakpoint-up(sm) {
  .row-categories {
    [class*="col-"] {
      min-width: 20%;
    }
  }

  .scrolling {
    .navbar-bot {
      .btn-outline-dark {
        padding: 0.7rem 1.2rem;
      }
    }
  }
}

@include media-breakpoint-up(md) {
  .row-categories {
    margin: -2px 0;
    width: 100%;

    [class*="col-"] {
      padding: 0;
      margin: 0;
      min-width: 1px;

      &:first-child {
        .btn {
          border-left: 2px solid $border-color;
        }
      }
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border-right: 2px solid $border-color;
      border-left: 0;
    }
  }

  .scrolling {
    .navbar-bot {
      padding: 0;
      .btn-outline-dark {
        padding: 0.5rem 1rem;
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .scrolling {
    .navbar-bot {
      padding: 0;
      .btn-outline-dark {
        padding: 1.2rem 1rem;
      }
    }
  }
}
</style>
