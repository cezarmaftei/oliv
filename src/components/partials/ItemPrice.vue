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

defineProps(["price", "oldPrice", "showX"]);
</script>
<template>
  <span class="price"
    ><span class="price-multiplier" v-show="showX">x </span
    ><del v-if="oldPrice && oldPrice !== price">({{ oldPrice }} lei)</del
    >{{ toFloat(price) }} lei</span
  >
</template>
