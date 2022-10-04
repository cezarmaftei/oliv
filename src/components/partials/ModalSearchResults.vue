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
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="search-modal-label">Cauta Produse</h5>
          <BtnClose type="button" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div class="modal-body">
          <SearchResults />
        </div>
      </div>
    </div>
  </div>
</template>
