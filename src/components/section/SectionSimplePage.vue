<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";
import { useRoute } from "vue-router";
const store = useOlivStore();
const route = useRoute();

const SectionSimplePageData = computed(() => {
  return store
    .getPageBySlug(route)
    .acf.page_sections.filter(
      (section) => section.acf_fc_layout === "SectionSimplePage"
    )[0];
});
</script>

<template>
  <div
    class="simple-page-wrapper bg-light p-8"
    v-html="SectionSimplePageData.page_content"
  ></div>
</template>

<style scoped lang="scss">
.simple-page-wrapper {
  @include global-border;

  :deep {
    ol,
    ul {
      margin-bottom: $paragraph-margin-bottom;
    }

    a {
      color: $orange;

      &:hover {
        color: $body-color;
      }
    }
  }
}
</style>
