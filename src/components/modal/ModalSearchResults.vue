<script setup>
import SearchResults from "@/components/partials/SearchResults.vue";
import BtnClose from "@/components/button/BtnClose.vue";
import { onMounted, ref } from "vue";

const searchModal = ref(false);

onMounted(() => {
  searchModal.value.addEventListener("shown.bs.modal", () => {
    document.getElementById("search-input").focus();
  });
});
</script>
<template>
  <div
    class="modal fade"
    id="search-modal"
    tabindex="-1"
    aria-labelledby="search-modal-label"
    aria-hidden="true"
    ref="searchModal"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content bg-light">
        <div class="modal-header">
          <BtnClose type="button" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body bg-light px-0 pb-5">
          <SearchResults />
        </div>
      </div>
    </div>
  </div>
</template>
