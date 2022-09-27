<script setup>
defineProps(["error"]);
</script>
<template>
  <transition name="height-element-sm">
    <div class="bg-warning">
      <p>{{ error }}</p>
    </div>
  </transition>
</template>
