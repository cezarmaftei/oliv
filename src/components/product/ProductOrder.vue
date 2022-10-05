<script setup>
import LoadImage from "../partials/LoadImage.vue";
import ItemPrice from "../partials/ItemPrice.vue";
import ProductWeight from "./ProductWeight.vue";

defineProps({
  product: Object,
});
</script>

<template>
  <div class="card card-product-order">
    <div class="d-flex position-relative">
      <figure>
        <LoadImage :id="product.thumbId" size="medium" />
      </figure>
      <div class="card-content">
        <h3 class="mb-0">{{ product.name }}</h3>

        <div class="product-small-details d-flex">
          <ProductWeight :weight="product.productWeight" />
          <ItemPrice class="ms-auto" :price="product.itemTotal" />
        </div>

        <div class="order-item-actions d-flex align-items-center">
          <div class="quantity-wrap">
            {{ product.productQty }}
          </div>
          <ItemPrice
            class="ms-auto"
            :showX="true"
            :price="product.productPrice"
          />
        </div>

        <div
          v-if="product.productExtras.length > 0"
          class="order-item-extras-actions"
        >
          <div
            class="extra-wrap d-flex"
            v-for="(extra, extraIndex) in product.productExtras"
            :key="extra"
          >
            <ItemPrice :showX="true" :price="extra.extraPrice" />
            <p class="extra-name m-0">
              {{ extra.extraName }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-product-cart {
  @include padding-bottom(2rem);
  @include margin-bottom(2rem);
  border-bottom: 1px solid $gray-200;
}

h3 {
  font-size: 2.2rem;
  padding-right: 2.5rem;
}

figure {
  flex: 0 0 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;

  :deep {
    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.show-extras {
  font-weight: $font-weight-bold;

  span {
    position: relative;

    &:after {
      content: "";
      position: absolute;
      left: 100%;
      top: 50%;
      margin-top: -0.5rem;
      margin-left: 0.5rem;
      transform: rotate(90deg);
      width: 1rem;
      height: 1rem;
      background: escape-svg(
          url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 266.39 209.56"><path d="M266.39,104.78,161.61,0l-20,20.13,70.45,70.44H0V119H212.07l-70.45,70.44,20,20.13L266.39,104.78Z"/></svg>')
        )
        no-repeat center center / 100% auto;
      @include transition($transition-base);
    }
  }

  &.is-open {
    span {
      &:after {
        transform: rotate(-90deg);
      }
    }
  }
}

.card-content {
  position: relative;
  flex-grow: 1;
}

.product-small-details {
  font-family: $font-family-lanekcut;
  margin-top: 0.5rem;
  font-size: 2.2rem;
  color: $gray-500;
  line-height: 2rem;

  .price {
    font-size: 2.4rem;
    color: $body-color;
  }
}

.order-item-actions,
.order-item-extras-actions {
  margin-top: 1rem;

  .price {
    font-weight: $font-weight-bold;
  }
}
.extra-wrap {
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;

  .extra-name {
    flex: 0 0 100%;
    max-width: 100%;
    order: 0;
  }

  .quantity-wrap {
    order: 1;
  }

  .price {
    order: 2;
    margin-left: auto;
  }
}

@include media-breakpoint-up(xs) {
  h3 {
    font-size: 2.6rem;
  }

  figure {
    flex: 0 0 10rem;
    height: 10rem;
  }
}

@include media-breakpoint-up(lg) {
  .order-page-inner {
    h3 {
      font-size: 3.2rem;
    }

    .product-small-details {
      .price {
        font-size: 3.2rem;
      }
    }
  }
}
</style>
