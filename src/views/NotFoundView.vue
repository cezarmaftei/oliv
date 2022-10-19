<script setup>
import HeaderInternal from "../components/HeaderInternal.vue";
import FooterInternal from "../components/FooterInternal.vue";
import PageNotFound from "../components/partials/PageNotFound.vue";
</script>
<template>
  <div id="page" class="page d-flex flex-column">
    <HeaderInternal />
    <main
      id="main-content"
      class="main-content container d-flex flex-column flex-grow-1"
    >
      <section
        class="section-bordered-content flex-grow-1 position-relative overflow-hidden"
      >
        <PageNotFound />
      </section>
    </main>
    <FooterInternal />
  </div>
</template>
