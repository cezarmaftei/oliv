<script setup>
import HeaderInternal from "@/components/HeaderInternal.vue";
import FooterInternal from "@/components/FooterInternal.vue";
import ProductListing from "@/components/product/ProductListing.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { inject } from "vue";

const store = useOlivStore();

const relatedProducts = (mainProduct) => {
  let relatedProducts = [];
  mainProduct.categories.forEach((productCat) => {
    store.storeData.products.forEach((product) => {
      product.categories.forEach((cat) => {
        const productExists = relatedProducts.filter(
          (relProduct) => relProduct.id === product.id
        );
        if (
          cat.name === productCat.name &&
          !productExists.length &&
          mainProduct.id !== product.id
        ) {
          relatedProducts.push(product);
        }
      });
    });
  });

  return relatedProducts;
};

const showMenuProductCats = inject("showMenuProductCats");
showMenuProductCats.value = true;
</script>

<template>
  <HeaderInternal />
  <section
    v-if="store.currentPage"
    class="section-product-single overflow-hidden py-10"
  >
    <div class="container">
      <ProductListing
        :product="store.currentPage"
        :productCount="0"
        :isSingle="true"
      />
    </div>
  </section>
  <section v-if="store.isLoaded" class="section-related-products">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Produse Similare</h2>
        </div>
        <div
          class="col-12 col-sm-6 col-md-4 col-lg-3"
          v-for="(product, productCount) in relatedProducts(store.currentPage)"
          :key="product"
        >
          <ProductListing :product="product" :productCount="productCount" />
        </div>
      </div>
    </div>
  </section>
  <FooterInternal />
</template>
