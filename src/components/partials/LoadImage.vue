<script setup>
import IconLoading from "@icons/IconLoading.vue";
import { useOlivStore } from "@/stores/oliv.js";
import VLazyImage from "v-lazy-image";
import { onBeforeMount } from "vue";

const props = defineProps({
  id: Number,
  size: String,
});

const store = useOlivStore();

onBeforeMount(() => {
  console.log();
  if (!store.imageData[props.id]) {
    store.fetchImageData(props.id).then((data) => {
      store.imageData[props.id] = data;
    });
  }
});
</script>
<template>
  <v-lazy-image
    v-if="store.imageData[id]"
    :srcset="
      size
        ? store.imageData[id][size].srcset
        : store.imageData[id]['large'].srcset
    "
    :sizes="
      size
        ? store.imageData[id][size].sizes
        : store.imageData[id]['large'].sizes
    "
    :src="
      size
        ? store.imageData[id][size].url[0]
        : store.imageData[id]['large'].url[0]
    "
  />
  <IconLoading v-else />
</template>
