<script setup>
import VRuntimeTemplate from "vue3-runtime-template";

defineProps({
  content: Object,
});
</script>
<template>
  <div class="container">
    <v-runtime-template :template="content.content" />
  </div>
</template>
