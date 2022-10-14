<script setup>
/**
 * Remove "floating point error" extra decimals
 * https://floating-point-gui.de/basic/
 * @param {String} number a number in string format
 * @returns {Float}
 */
const toFloat = (number) => {
  return parseFloat(number).toFixed(2);
};

defineProps(["price", "showX"]);
</script>
<template>
  <span class="price"
    ><span class="price-multiplier" v-show="showX">x</span
    >{{ toFloat(price) }} lei</span
  >
</template>
