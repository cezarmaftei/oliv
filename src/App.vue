<script setup>
import { RouterView, useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import { Head, useHeadRaw } from "@vueuse/head";
import { provide, ref } from "vue";
import ModalSearchResults from "@/components/modal/ModalSearchResults.vue";
import ModalLogin from "@/components/modal/ModalLogin.vue";
import ModalShippingAddresses from "./components/modal/ModalShippingAddresses.vue";
import ModalBillingAddresses from "./components/modal/ModalBillingAddresses.vue";
import { computed } from "vue";
import UpdateLoading from "./components/partials/UpdateLoading.vue";

const store = useOlivStore();
const route = useRoute();
store.initWebsite();

const showMenuProductCats = ref(false);
provide("showMenuProductCats", showMenuProductCats);

const activeCat = ref("Toate");
provide("activeCat", activeCat);

useHeadRaw({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        store.getPageBySlug(route)
          ? JSON.stringify(store.getPageBySlug(route).yoast_head_json.schema)
          : ""
      ),
    },
  ],
});
</script>

<template>
  <Head v-if="store.getPageBySlug(route)">
    <title>{{ store.getPageBySlug(route).yoast_head_json.title }}</title>
    <meta
      name="robots"
      content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    />
    <link
      rel="canonical"
      :href="store.getPageBySlug(route).yoast_head_json.canonical"
    />
    <meta
      property="og:locale"
      :content="store.getPageBySlug(route).yoast_head_json.og_locale"
    />
    <meta
      property="og:type"
      :content="store.getPageBySlug(route).yoast_head_json.og_type"
    />
    <meta
      property="og:title"
      :content="store.getPageBySlug(route).yoast_head_json.title"
    />
    <meta
      property="og:url"
      :content="store.getPageBySlug(route).yoast_head_json.og_url"
    />
    <meta
      property="og:site_name"
      :content="store.getPageBySlug(route).yoast_head_json.og_site_name"
    />
    <meta
      property="article:publisher"
      :content="store.getPageBySlug(route).yoast_head_json.article_publisher"
    />
    <meta
      property="article:modified_time"
      :content="
        store.getPageBySlug(route).yoast_head_json.article_modified_time
      "
    />
    <meta
      property="og:image"
      :content="store.getPageBySlug(route).yoast_head_json.og_image[0].url"
    />
    <meta
      property="og:image:width"
      :content="store.getPageBySlug(route).yoast_head_json.og_image[0].width"
    />
    <meta
      property="og:image:height"
      :content="store.getPageBySlug(route).yoast_head_json.og_image[0].height"
    />
    <meta
      property="og:image:type"
      :content="store.getPageBySlug(route).yoast_head_json.og_image[0].type"
    />
    <meta
      name="twitter:card"
      :content="store.getPageBySlug(route).yoast_head_json.twitter_card"
    />
  </Head>

  <div
    v-if="store.userData.loggedIn && !store.userData.accountActive"
    class="container mx-auto"
  >
    <div class="row">
      <div class="col-12">
        <div class="info-message info-message-lg text-center mb-0">
          Inca nu poti efectua comenzi de pe acest cont. Verifica-ti adresa de
          email si activeaza-ti contul.
        </div>
      </div>
    </div>
  </div>

  <UpdateLoading />
  <ModalLogin />
  <ModalSearchResults />
  <ModalShippingAddresses />
  <ModalBillingAddresses />
  <RouterView />
</template>
