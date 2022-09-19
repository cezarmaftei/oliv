<script setup>
defineProps(["price", "showX"]);
</script>
<template>
  <span class="price"
    ><span class="price-multiplier" v-show="showX">x</span>
    {{ price }} lei</span
  >
</template>
