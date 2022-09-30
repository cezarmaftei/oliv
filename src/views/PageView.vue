<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { useRoute } from "vue-router";
import HeaderInternal from "@/components/HeaderInternal.vue";
import FooterInternal from "@/components/FooterInternal.vue";

// Dynamic components
import SectionSplash from "@/components/section/SectionSplash.vue";
import SectionShop from "@/components/section/SectionShop.vue";
import SectionCart from "@/components/section/SectionCart.vue";
import SectionCheckout from "@/components/section/SectionCheckout.vue";
import SectionAccount from "@/components/section/SectionAccount.vue";
import SectionSingleProduct from "../components/section/SectionSingleProduct.vue";
import SectionRelatedProducts from "../components/section/SectionRelatedProducts.vue";
import UserOrders from "@/components/user-account/UserOrders.vue";
import UserAddresses from "@/components/user-account/UserAddresses.vue";
import UserGeneral from "@/components/user-account/UserGeneral.vue";
import IconLoading from "../components/icons/IconLoading.vue";

const store = useOlivStore();
const route = useRoute();

const pageTemplates = {
  SectionSplash,
  SectionShop,
  SectionCart,
  SectionCheckout,
  SectionAccount,
};

const accountSections = {
  "comenzile-mele": UserOrders,
  "adresele-mele": UserAddresses,
  "detalii-cont": UserGeneral,
};
</script>

<template>
  <div id="page" class="page d-flex flex-column">
    <HeaderInternal />
    <main
      id="main-content"
      class="main-content container d-flex flex-column flex-grow-1"
      v-if="store.isLoaded"
    >
      <!-- page layout -->
      <section
        v-if="['home', 'page'].includes(route.name)"
        class="d-flex flex-column flex-grow-1"
      >
        <component
          :is="
            pageTemplates[
              store.getPageBySlug(route).acf.page_sections[0].acf_fc_layout
            ]
          "
        ></component>
      </section>
      <!-- /.page layout -->

      <!-- single product layout -->
      <SectionSingleProduct v-if="route.name === 'product'" />
      <SectionRelatedProducts v-if="route.name === 'product'" />
      <!-- /.single product layout -->

      <!-- account layout -->
      <section
        class="section-my-account overflow-hidden flex-grow-1 mb-8"
        v-if="route.name === 'account'"
      >
        <div class="container">
          <component :is="accountSections[route.params.slug]"></component>
        </div>
      </section>
      <!-- /.account layout -->
    </main>
    <IconLoading v-if="!store.isLoaded" />
    <FooterInternal />
  </div>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
}

.section-my-account {
  border: 2px solid $border-color;
  border-top: 0;
}
</style>
