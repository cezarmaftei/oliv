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
import SectionOrderCompleted from "../components/section/SectionOrderCompleted.vue";
import SectionBlog from "../components/section/SectionBlog.vue";
import SectionContact from "../components/section/SectionContact.vue";
import SectionBlogSingle from "../components/section/SectionBlogSingle.vue";
import PageNotFound from "../components/partials/PageNotFound.vue";
import IconLoading from "../components/icons/IconLoading.vue";
import { computed } from "vue";

const store = useOlivStore();
const route = useRoute();

const pageTemplates = {
  SectionSplash,
  SectionShop,
  SectionCart,
  SectionCheckout,
  SectionAccount,
  SectionOrderCompleted,
  SectionBlog,
  SectionContact,
};

const pageClass = computed(() => {
  if (route.params.slug)
    return `page-${route.name} page-${route.name}-${route.params.slug}`;
  else return `page-${route.name}`;
});
</script>

<template>
  <div id="page" class="page d-flex flex-column" :class="pageClass">
    <HeaderInternal />
    <main
      id="main-content"
      class="main-content container d-flex flex-column flex-grow-1 my-7"
    >
      <section
        v-if="store.isLoaded && store.getPageBySlug(route)"
        class="flex-grow-1 position-relative"
        :class="{
          'section-bordered-content':
            ['account'].indexOf(route.name) > -1 ||
            ['finalizare', 'cos', 'comanda-plasata'].indexOf(
              route.params.slug
            ) > -1,
        }"
      >
        <!-- page layout -->
        <component
          v-if="['home', 'page', 'product-category'].includes(route.name)"
          :is="
            pageTemplates[
              store.getPageBySlug(route).acf.page_sections[0].acf_fc_layout
            ]
          "
        ></component>
        <!-- /.page layout -->

        <!-- single product layout -->
        <div
          class="single-product-wrapper"
          v-else-if="route.name === 'product'"
        >
          <SectionSingleProduct />
          <SectionRelatedProducts />
        </div>
        <!-- /.single product layout -->

        <!-- account layout -->
        <SectionAccount v-else-if="route.name === 'account'" />
        <!-- /.account layout -->

        <!-- single article layout -->
        <SectionBlogSingle
          v-else-if="route.name === 'article'"
          :slug="route.params.slug"
        />
        <!-- /.single article layout -->
      </section>

      <section v-else class="section-bordered-content flex-grow-1">
        <PageNotFound v-if="store.isLoaded" />
        <IconLoading class="d-block mx-auto" v-else />
      </section>
    </main>
    <FooterInternal />
  </div>
</template>

<style scoped lang="scss">
.page:before,
.page:after {
  content: "";
  display: block;
  position: fixed;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}

@include media-breakpoint-up(sm) {
  .page-page:before,
  .page-article:before {
    background: url("/bg-checkout-top-left.png") no-repeat left 30% / 15rem auto,
      url("/bg-checkout-top-right.png") no-repeat right 5% / 15rem auto,
      url("/bg-checkout-bottom-right.png") no-repeat right bottom / 15rem auto;
  }

  .page-page:after,
  .page-article:after {
    background: url("/bg-meniu-bottom-left.png") no-repeat left 90% / auto;
  }

  .page-home:before {
    background: url("/bg-meniu-bottom-right.png") no-repeat right bottom / 30rem
      auto;
  }

  .page-home:after {
    background: url("/bg-meniu-top-right.png") no-repeat right 5% / auto,
      url("/bg-meniu-bottom-left.png") no-repeat left 90% / auto;
  }

  .page-product:before {
    background: url("/bg-meniu-bottom-right.png") no-repeat right bottom / 30rem
      auto;
  }

  .page-product:after {
    background: url("/bg-product-left-top.png") no-repeat left 25% / auto,
      url("/bg-product-right-top.png") no-repeat right 10% / auto,
      url("/bg-meniu-bottom-left.png") no-repeat left 90% / auto;
  }

  .page-account:before {
    background: url("/bg-account-top-left.png") no-repeat left 30% / 15rem auto,
      url("/bg-account-top-right.png") no-repeat right 5% / 15rem auto,
      url("/bg-account-bottom-right.png") no-repeat right bottom / 15rem auto;
  }

  .page-account:after {
    background: url("/bg-meniu-bottom-left.png") no-repeat left 90% / auto;
  }
}

@include media-breakpoint-up(xxl) {
  .page:before {
    max-width: 1500px;
  }

  .page:after {
    max-width: 1370px;
  }
}

// .page-home:before {
//   @include media-breakpoint-up(sm) {
//     background: url("/bg-meniu-top-right.png") no-repeat right top / auto,
//       url("/bg-meniu-bottom-right.png") no-repeat right bottom / 25vh auto,
//       url("/bg-meniu-bottom-left.png") no-repeat left bottom / auto;
//   }
// }
</style>
