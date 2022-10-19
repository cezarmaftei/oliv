<script setup>
defineProps(["success", "error"]);
</script>

<template>
  <transition name="height-element-sm">
    <div class="form-info-message" v-if="success || error">
      <div :class="{ 'success-message': success, 'error-message': error }">
        {{ success || error }}
      </div>
    </div>
  </transition>
</template>
