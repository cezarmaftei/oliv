<script setup>
import { computed, provide, ref } from "vue";
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import VRuntimeTemplate from "vue3-runtime-template";
import HeaderInternal from "@/components/HeaderInternal.vue";
import FooterInternal from "@/components/FooterInternal.vue";

const route = useRoute();
const store = useOlivStore();
const page = computed(() => {
  const pageData = store.pageData.filter(
    (data) => data["slug"] === route.params.slug
  );
  if (pageData) return pageData[0];
  return false;
});
provide("pageData", page);

const showCategories = ref("all");
provide("showCategories", showCategories);

const showUserMenuItems = ref({
  orders: {
    show: true,
    title: "Comenzi",
  },
  addresses: {
    show: false,
    title: "Adresele Mele",
  },
  general: {
    show: false,
    title: "Detalii Cont",
  },
});
provide("showUserMenuItems", showUserMenuItems);
</script>

<template>
  <HeaderInternal />
  <v-runtime-template
    v-if="page"
    :template="page.content.rendered"
  ></v-runtime-template>
  <FooterInternal />
</template>

<style></style>
