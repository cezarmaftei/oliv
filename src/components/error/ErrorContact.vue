<script setup>
defineProps(["error"]);
</script>
<template>
  <transition name="height-element-sm">
    <div class="error-message">
      {{ error }}
    </div>
  </transition>
</template>
