<script setup>
defineProps(["error"]);
</script>
<template>
  <transition name="height-element-sm">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </transition>
</template>
