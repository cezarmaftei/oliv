<script setup>
import { computed, onUnmounted, ref } from "vue";
import { useOlivStore } from "@/stores/oliv.js";
import VRuntimeTemplate from "vue3-runtime-template";
import LogoOliv from "@icons/LogoOliv.vue";
import IconSun from "@icons/IconSun.vue";

const store = useOlivStore();
const home = computed(() => {
  const homeData = store.pageData.filter((data) => data["slug"] === "home");
  if (homeData) return homeData[0];
  return false;
});

const time = ref(null);

const interval = setInterval(() => {
  time.value = Intl.DateTimeFormat(navigator.language, {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format();
}, 1000);

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <section class="homepage pt-4 pb-10">
    <div class="container d-flex flex-column">
      <nav class="main-nav">
        <ul v-if="store.websiteOptions.main_menu">
          <li
            v-for="link in store.websiteOptions.main_menu.left_side"
            :key="link.title"
          >
            <router-link :to="link.link">
              {{ link.title }}
            </router-link>
          </li>
          <li>
            <router-link to="/">
              <LogoOliv />
            </router-link>
          </li>
          <li
            v-for="link in store.websiteOptions.main_menu.right_side"
            :key="link.title"
          >
            <router-link :to="link.link">
              {{ link.title }}
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="homepage-content">
        <v-runtime-template
          v-if="home"
          :template="home.content.rendered"
        ></v-runtime-template>
      </div>
      <footer class="homepage-footer">
        <div>
          <IconSun />
          <div v-text="time"></div>
          |
          <div>Iasi</div>
        </div>
        <div>Sf. Petru Movila, nr. 68</div>
      </footer>
    </div>
  </section>
</template>
