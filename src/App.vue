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

<style lang="scss">
.scale-element-leave-active {
  transition: all 0.1s cubic-bezier(0.75, 0.25, 0.13, 0.92);
}

.scale-element-enter-active {
  transition: all 0.15s 0.1s cubic-bezier(0.75, 0.25, 0.13, 0.92);
}

.scale-element-enter-from,
.scale-element-leave-to {
  transform: scale(0);
}

.scale-element-enter-to,
.scale-element-leave-from {
  transform: scale(1);
}

.height-element-enter-active,
.height-element-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.height-element-enter-from,
.height-element-leave-to {
  max-height: 0;
}

.height-element-enter-to,
.height-element-leave-from {
  max-height: 100rem;
}

.height-element-sm-enter-active,
.height-element-sm-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.height-element-sm-enter-from,
.height-element-sm-leave-to {
  max-height: 0;
}

.height-element-sm-enter-to,
.height-element-sm-leave-from {
  max-height: 30rem;
}

.add-remove-element-enter-from {
  opacity: 0;
  transform: translateX(-30rem);
  max-height: 0;
}

.add-remove-element-enter-active,
.add-remove-element-leave-active {
  transition: all 0.25s 0.5s ease;
}

.add-remove-element-enter-active.no-delay,
.add-remove-element-leave-active.no-delay {
  transition: all 0.25s ease;
}

.add-remove-element-leave-from,
.add-remove-element-enter-to {
  opacity: 1;
  transform: translateX(0);
  max-height: 1000px;
}

.add-remove-element-leave-to {
  opacity: 0;
  transform: translateX(30rem);
  max-height: 0;
}
</style>
