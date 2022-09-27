<script setup>
import HeaderInternal from "@/components/HeaderInternal.vue";
import FooterInternal from "@/components/FooterInternal.vue";
import UserOrders from "@/components/user-account/UserOrders.vue";
import UserAddresses from "@/components/user-account/UserAddresses.vue";
import UserGeneral from "@/components/user-account/UserGeneral.vue";
// import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";

// const store = useOlivStore();
const route = useRoute();

const accountSections = {
  "comenzile-mele": UserOrders,
  "adresele-mele": UserAddresses,
  "detalii-cont": UserGeneral,
};
</script>

<template>
  <HeaderInternal />
  <section class="section-my-account overflow-hidden mb-5">
    <div class="container">
      <component :is="accountSections[route.params.slug]"></component>
    </div>
  </section>
  <FooterInternal />
</template>

<style scoped lang="scss">
.section-my-account {
  flex-grow: 1;

  > .container {
    height: 100%;
  }
}
</style>
