<script setup>
import { useRoute, useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { inject, onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const store = useOlivStore();

const showUserMenuItems = inject("showUserMenuItems");

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
  } else {
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
  <ul v-if="store.userData.success">
    <li
      v-for="(menuItem, menuItemName) in showUserMenuItems"
      :key="menuItemName"
    >
      <button @click="updateVisibleItem(menuItemName)">
        {{ menuItem.title }}
      </button>
    </li>
    <li><button @click="store.userActions('logout')">Logout</button></li>
  </ul>
</template>
