<script setup>
import LoadImage from "../partials/LoadImage.vue";
import ItemPrice from "../partials/ItemPrice.vue";

defineProps({
  product: Object,
});
</script>

<template>
  <div class="card card-product-order">
    <div
      class="d-flex flex-column flex-sm-row text-center text-sm-start align-items-md-center"
    >
      <figure>
        <LoadImage :id="product.thumbId" size="medium" />
      </figure>
      <div class="card-content flex-sm-grow-1">
        <div class="h4 row mb-2 mb-md-1">
          <div class="col-12 col-md-auto">
            {{ product.productQty }} x {{ product.name }}(<ItemPrice
              :price="product.productPrice"
            />)
          </div>
          <div class="d-none d-md-block col-md-auto ms-md-auto">
            <ItemPrice :price="product.itemTotal" />
          </div>
        </div>

        <div v-if="product.productExtras.length" class="order-item-extras">
          <div
            class="row mb-1 mb-md-0"
            v-for="extra in product.productExtras"
            :key="extra"
            v-show="parseInt(extra.extraQty) > 0"
          >
            <div class="col-auto">
              {{ extra.extraQty }} x {{ extra.extraName }}(<ItemPrice
                :price="extra.extraPrice"
              />)
            </div>
          </div>
        </div>

        <ItemPrice
          class="h4 d-block text-center text-sm-end d-md-none"
          :price="product.itemTotal"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-product-order {
  @include margin-bottom(2rem);
  @include padding-bottom(2rem);
  border-bottom: 1px solid $gray-300;
}

figure {
  flex: 0 0 15rem;
  max-width: 15rem;
  height: 15rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 2rem;

  :deep {
    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

@include media-breakpoint-up(sm) {
  figure {
    flex: 0 0 6rem;
    max-width: 6rem;
    height: 6rem;
    margin: 0 2rem 0 0;
  }
}

@include media-breakpoint-up(md) {
  figure {
    flex: 0 0 8rem;
    max-width: 8rem;
    height: 8rem;
  }
}
</style>
