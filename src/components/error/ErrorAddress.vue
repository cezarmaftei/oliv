<script setup>
defineProps(["error", "success"]);
</script>
<template>
  <transition name="height-element-sm">
    <div v-if="error || success" class="message" ref="errorElement">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        Adresa a fost adaugata cu success
      </div>
    </div>
  </transition>
</template>
