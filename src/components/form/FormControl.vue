<script setup>
import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();
const props = defineProps(["fieldFor", "fieldName"]);
const fieldPlaceholder = () => {
  let placeholder = store[props.fieldFor][props.fieldName].name;
  if (store[props.fieldFor][props.fieldName].required) placeholder += "*";
  return placeholder;
};
</script>
<template>
  <input
    :name="fieldName"
    :type="store[fieldFor][fieldName].type"
    class="form-control"
    v-model="store[fieldFor][fieldName].value"
    :placeholder="fieldPlaceholder()"
    :required="store[fieldFor][fieldName].required"
  />
</template>
