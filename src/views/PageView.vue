<script setup>
import { provide, ref } from "vue";
import { useOlivStore } from "@/stores/oliv.js";
import HeaderInternal from "@/components/HeaderInternal.vue";
import FooterInternal from "@/components/FooterInternal.vue";

// Dynamic components
import SectionSplash from "@/components/section/SectionSplash.vue";
import SectionShop from "@/components/section/SectionShop.vue";
import SectionCheckout from "@/components/section/SectionCheckout.vue";
import SectionAccount from "@/components/section/SectionAccount.vue";

const store = useOlivStore();

const showUserMenuItems = ref({
  orders: {
    show: true,
    title: "Comenzi",
  },
  addresses: {
    show: false,
    title: "Adresele Mele",
  },
  general: {
    show: false,
    title: "Detalii Cont",
  },
});
provide("showUserMenuItems", showUserMenuItems);
</script>

<template>
  <HeaderInternal />
  <div v-if="store.isLoaded && store.currentPage">
    <section
      v-for="pageSection in store.currentPage.acf.page_sections"
      :key="pageSection"
    >
      <SectionSplash
        v-if="pageSection.acf_fc_layout === 'SectionSplash'"
        :content="pageSection"
      ></SectionSplash>

      <SectionShop
        v-if="pageSection.acf_fc_layout === 'SectionShop'"
        :content="pageSection"
      ></SectionShop>

      <SectionCheckout
        v-if="pageSection.acf_fc_layout === 'SectionCheckout'"
        :content="pageSection"
      ></SectionCheckout>

      <SectionAccount
        v-if="pageSection.acf_fc_layout === 'SectionAccount'"
        :content="pageSection"
      ></SectionAccount>
    </section>
  </div>
  <div v-else-if="store.isLoaded">
    <h1>Not found!</h1>
  </div>

  <FooterInternal />
</template>

<style></style>
