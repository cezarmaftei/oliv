<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import VRuntimeTemplate from "vue3-runtime-template";

const route = useRoute();
const store = useOlivStore();
const page = computed(() => {
  const pageData = store.pageData.filter(
    (data) => data["slug"] === route.params.slug
  );
  if (pageData) return pageData[0];
  return false;
});
</script>

<template>
  <v-runtime-template
    v-if="page"
    :template="page.content.rendered"
  ></v-runtime-template>
</template>

<style></style>
