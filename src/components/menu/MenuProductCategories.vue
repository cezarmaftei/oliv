<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";
import { useRoute } from "vue-router";
import IconLoading from "../icons/IconLoading.vue";

const route = useRoute();
const store = useOlivStore();
const activeCat = inject("activeCat");
</script>
<template>
  <div
    v-if="store.isLoaded"
    class="row row-categories justify-content-center g-50"
  >
    <div class="col-auto flex-grow-1">
      <router-link
        @click="activeCat = 'toate'"
        :class="
          route.name == 'home' || route.params.slug === 'toate' ? 'active' : ''
        "
        class="btn btn-primary"
        :to="{ path: `/category/toate` }"
        >Toate</router-link
      >
    </div>
    <div
      class="col-auto flex-grow-1"
      v-for="cat in store.storeData.categories"
      :key="cat"
    >
      <router-link
        @click="activeCat = cat.slug"
        :class="route.path.indexOf(cat.slug) !== -1 ? 'active' : ''"
        class="btn btn-primary"
        :to="{ path: `/category/${cat.slug}` }"
      >
        {{ cat.name }}
      </router-link>
    </div>
  </div>
  <div
    v-else
    class="menu-loading d-flex align-items-center justify-content-center"
  >
    <IconLoading />
  </div>
</template>

<style scoped lang="scss">
.menu-loading {
  min-height: 50px;
  @include global-border;
  margin: -2px 0 0;
}

.navbar-bot {
  h3 {
    overflow: hidden;
    @include transition($transition-base);
    max-height: 100px;
  }

  .btn-primary {
    width: 100%;
  }
}

@include media-breakpoint-up(sm) {
  .row-categories {
    [class*="col-"] {
      min-width: 20%;
    }
  }

  .navbar-bot {
    .btn-primary {
      font-size: 2.4rem;
      padding: 0.5rem;
    }
  }

  .cloned {
    .navbar-bot {
      .btn-primary {
        padding: 0.7rem 1.2rem;
      }
    }
  }
}

@include media-breakpoint-up(lg) {
  .row-categories {
    margin: -2px 0 0;
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
}
</style>
