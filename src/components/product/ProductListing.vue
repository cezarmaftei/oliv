<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import LoadImage from "@/components/partials/LoadImage.vue";
import AddToCart from "@/components/button/AddToCart.vue";
import ProductWeight from "@/components/product/ProductWeight.vue";
import ItemPrice from "@/components/partials/ItemPrice.vue";
import { onMounted, ref } from "vue";
import { computed } from "vue";

const props = defineProps({
  product: Object,
  productCount: Number,
  isSingle: Boolean,
});

const store = useOlivStore();
const currentProductExtras = store.getProductExtras(props.product);
const productPrice = ref(parseFloat(props.product.price));
const productQtys = ref({});
const productDescriptionTrimmed = ref("");

onMounted(() => {
  productQtys.value["productQty"] = 1;

  if (currentProductExtras) {
    for (const [currentExtraId, currentExtraData] of Object.entries(
      currentProductExtras
    )) {
      productQtys.value[currentExtraData._id] = 0;
    }
  }

  const desc = document.createElement("div");
  desc.innerHTML = props.product.description;
  const maxLength = 55;

  productDescriptionTrimmed.value =
    desc.textContent.length > maxLength
      ? desc.textContent.substring(0, maxLength) + "..."
      : desc.textContent.substring(0, maxLength);
});

const productWeight = (product) => {
  if (product.categories.filter((cat) => cat.slug === "bauturi").length)
    return product.weight.length ? `${product.weight}ml` : "";
  else return product.weight.length ? `${product.weight}g` : "";
};

/**
 * Add product to cart
 * @param {Int} quantity
 * @param {DOMNode} button
 */
const addToCart = (quantity, button) => {
  if (typeof quantity === "undefined") quantity = 1;

  // Cart product object:
  //
  // id -> product ID === Is added here
  // name -> product name === Is added here
  // thumbId -> product thumbnail ID === Is added here
  // productWeight -> product weight === Is added here
  // productQty -> quantity === Is added here
  // productPrice -> product price === Is added here
  // isCouponEligible -> accepts coupon discount?  === Is added here
  // productExtras -> array with extra options: === Is added here
  //    _id -> extra ID === Is added here
  //    extraName -> extra name === Is added here
  //    extraQty -> extra quantity === Is added here
  //    extraPrice -> extra price === Is added here
  //    min -> extra minimum quantity === Is added here
  //    max -> extra maximum quantity === Is added here
  // productWithExtrasPrice -> product price including extras
  // itemTotal -> productQty * productWithExtrasPrice - item total price
  let cartProductExtras = [];

  if (currentProductExtras) {
    for (const [currentExtraId, currentExtraData] of Object.entries(
      currentProductExtras
    )) {
      cartProductExtras.push({
        _id: currentExtraData._id,
        extraName: currentExtraData._name,
        extraQty: productQtys.value[currentExtraData._id],
        extraPrice: currentExtraData._price,
        _min: currentExtraData._min,
        _max: currentExtraData._max,
      });
    }
  }

  // console.log(props.product);

  // Exclude categories from coupon discounts
  // 24 - Bauturi
  const excludeCatsFromDiscount = [24];
  const containsExcludedCat = props.product.categories.filter((cat) =>
    excludeCatsFromDiscount.includes(cat.id)
  );

  store.cartData.items.push({
    id: props.product.id,
    name: props.product.name,
    thumbId: props.product.images[0].id,
    productWeight: productWeight(props.product),
    productQty: quantity,
    productPrice: props.product.price,
    isCouponEligible: containsExcludedCat.length ? false : true,
    productExtras: cartProductExtras,
    productWithExtrasPrice: 0, // Will be updated with this.updateCartTotals()
    itemTotal: 0, // Will be updated with this.updateCartTotals()
  });

  button.classList.add("done");
  setTimeout(() => {
    button.classList.remove("done");
  }, 500);
};

const updateProductQty = (value, isNewValue) => {
  const addedValue = parseFloat(value);

  // Do nothing if he's leaving the field empty
  if (isNaN(addedValue)) return;

  const oldValue = productQtys.value.productQty;
  let newValue = isNewValue ? addedValue : oldValue + addedValue;

  // Do nothing if the new values are not eligible
  if (newValue < 1) {
    // The following line is triggering a reactive change
    // If deleted, sometimes the user can add a negative number and the input value doesn't update
    productQtys.value.productQty = 0;
    newValue = 1;
  }

  productQtys.value.productQty = newValue;
};

const updateProductExtraQty = (extraId, event) => {
  // He didn't stopped typing
  if (event.type === "keyup" && event.target.value === "") return;

  // Set the default value to false
  let newValue = false;

  // Button was clicked
  if (event.type === "click") {
    const oldValue = Number(
      event.target.closest(".quantity-wrap").querySelector("input").value
    );
    newValue =
      event.target.textContent.trim() === "+" ? oldValue + 1 : oldValue - 1;
  }

  // User manually updated the qty input field
  if (event.type === "keyup") {
    newValue = Number(event.target.value);
  }

  // Get product extra object
  const extraData = currentProductExtras.filter((data) => data._id === extraId);

  // On focusOut he left the field blank, set it to 0
  if (!newValue && event.type === "focusout") {
    event.target.value = extraData[0]._min;
  }

  // If value is _min
  if (newValue <= extraData[0]._min) {
    productQtys.value[extraId] = extraData[0]._min;

    // Disable minus
    event.target
      .closest(".quantity-wrap")
      .querySelector(".extra-qty-minus")
      .setAttribute("disabled", "disabled");

    // Be sure that plus is enabled
    event.target
      .closest(".quantity-wrap")
      .querySelector(".extra-qty-plus")
      .removeAttribute("disabled");

    return;
  }

  // If value is _max
  if (newValue >= extraData[0]._max) {
    productQtys.value[extraId] = extraData[0]._max;

    // Disable plus
    event.target
      .closest(".quantity-wrap")
      .querySelector(".extra-qty-plus")
      .setAttribute("disabled", "disabled");

    // Be sure that minus is enabled
    event.target
      .closest(".quantity-wrap")
      .querySelector(".extra-qty-minus")
      .removeAttribute("disabled");

    return;
  }

  // Set value if none of the above happens
  productQtys.value[extraId] = newValue;
  event.target
    .closest(".quantity-wrap")
    .querySelector(".extra-qty-minus")
    .removeAttribute("disabled");
  event.target
    .closest(".quantity-wrap")
    .querySelector(".extra-qty-plus")
    .removeAttribute("disabled");
};

/**
 * Update product price on single product display
 */
const currentItemPrice = computed(() => {
  let price = productQtys.value.productQty * props.product.price;

  if (currentProductExtras) {
    for (const [currentExtraId, currentExtraData] of Object.entries(
      currentProductExtras
    )) {
      price +=
        currentExtraData._price *
        productQtys.value[currentExtraData._id] *
        productQtys.value.productQty;
    }
  }

  return price;
});

const isNew = computed(() => {
  let productDate = Date.parse(props.product.date_created);
  productDate = new Date(productDate);
  const currentDate = new Date();

  if (
    currentDate.getMonth() - productDate.getMonth() < 2 &&
    currentDate.getFullYear() === productDate.getFullYear()
  )
    return true;

  return false;
});

const productCadClass = () => {
  let cardClass = "card-product-listing";

  if (props.isSingle) {
    cardClass = "product-single";

    if (store.isCustomDiscountEligible(props.product.id)) {
      cardClass += " has-custom-discount";
    }
  }

  return cardClass;
};
</script>

<template>
  <div class="card" :class="productCadClass()">
    <div
      class="product-custom-discount-badge d-flex align-items-center justify-content-center"
      v-if="isSingle && store.isCustomDiscountEligible(product.id)"
    >
      <div
        class="text-center"
        v-html="store.customDiscounts.notificare_client"
      ></div>
    </div>

    <div class="product-title">
      <h2>
        <span v-if="isSingle">
          {{ product.name }}
        </span>
        <router-link v-else :to="`/meniu/${product.slug}`">{{
          product.name
        }}</router-link>
      </h2>
    </div>
    <figure
      v-if="product.images.length"
      class="d-flex align-items-center justify-content-center"
    >
      <LoadImage v-if="isSingle" :id="product.images[0].id" size="medium" />
      <router-link v-else :to="`/meniu/${product.slug}`">
        <div
          class="product-new d-flex align-items-center justify-content-center"
          v-if="isNew"
        >
          NEW
        </div>

        <div
          class="product-custom-discount-badge d-flex align-items-center justify-content-center"
          v-if="store.isCustomDiscountEligible(product.id)"
        >
          <div
            class="text-center"
            v-html="store.customDiscounts.notificare_client"
          ></div>
        </div>
        <LoadImage :id="product.images[0].id" size="medium" />
      </router-link>
    </figure>
    <div class="product-description">
      <div v-if="!isSingle" class="text-truncate-l2 mb-1">
        <p class="mb-0">{{ productDescriptionTrimmed }}</p>
      </div>
      <div v-else v-html="product.description"></div>
      <ProductWeight :weight="productWeight(product)" />
    </div>
    <!-- Single product -->
    <div class="single-product-actions" v-if="isSingle">
      <div v-if="currentProductExtras" class="single-product-extras-actions">
        <div
          class="extra-wrap"
          v-for="(extra, index) in currentProductExtras"
          :key="extra"
        >
          <div class="extra-inner">
            <h3 v-if="index === 0">Adauga extra</h3>
            <p class="extra-name mb-1">
              {{ extra._name }}
              <span
                >+
                <ItemPrice :price="extra._price" />
              </span>
            </p>
            <div class="quantity-wrap">
              <button
                disabled
                class="extra-qty-minus"
                @click="updateProductExtraQty(extra._id, $event)"
              >
                -
              </button>
              <input
                type="text"
                :value="productQtys[extra._id]"
                @keyup="updateProductExtraQty(extra._id, $event)"
                @focusout="updateProductExtraQty(extra._id, $event)"
              />
              <button
                class="extra-qty-plus"
                @click="updateProductExtraQty(extra._id, $event)"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="single-product-quantity-wrap">
        <h3 class="mt-3">Cantitate</h3>
        <div class="quantity-wrap">
          <button @click="updateProductQty(-1)">-</button>
          <input
            type="text"
            @keyup="updateProductQty($event.target.value, true)"
            :value="productQtys.productQty"
            :v-model="productQtys.productQty"
            readonly
          />
          <button @click="updateProductQty(1)">+</button>
        </div>
      </div>

      <div class="single-product-add">
        <span class="price-tag d-none d-md-block pe-0">Pret</span>
        <ItemPrice :price="currentItemPrice" />
        <AddToCart @click="addToCart(productQtys.productQty, $event.target)">
          <span>+{{ productQtys.productQty }}</span>
        </AddToCart>
      </div>
    </div>
    <!-- Product listing -->
    <div v-else class="product-actions d-flex flex-wrap align-items-center">
      <ItemPrice :price="productPrice" />
      <AddToCart @click="addToCart(1, $event.target)">
        <span>+1</span>
      </AddToCart>
    </div>
  </div>
</template>

<style scoped lang="scss">
.product-new {
  background: url("/bg-product-new.png") no-repeat center center / 100% 100%;
  font-family: $font-family-lanekcut;
  font-size: 1.8rem;
  color: $white;
  position: absolute;
  z-index: 10;
  width: 3.2rem;
  height: 3.2rem;
  right: -0.5rem;
  top: -1rem;

  @include media-breakpoint-up(sm) {
    font-size: 2.4rem;
    width: 6.2rem;
    height: 6.2rem;
    right: -1.5rem;
    top: -1.5rem;
  }

  @include media-breakpoint-up(md) {
    right: -2.1rem;
    top: -2.7rem;
  }

  @include media-breakpoint-up(lg) {
    right: -2.7rem;
  }
}

.product-custom-discount-badge {
  background: url("/bg-product-new.png") no-repeat center center / 100% 100%;
  font-family: $font-family-lanekcut;
  line-height: 0.8;
  font-size: 1.6rem;
  color: $white;
  position: absolute;
  z-index: 10;
  width: 6.2rem;
  height: 6.2rem;
  right: -0.5rem;
  top: -1rem;

  :deep {
    span {
      display: block;
      font-size: 2.8rem;
    }
  }

  @include media-breakpoint-up(sm) {
    right: -1.5rem;
    top: -1.5rem;
  }

  @include media-breakpoint-up(md) {
    right: -2.1rem;
    top: -2.7rem;
  }

  @include media-breakpoint-up(lg) {
    right: -2.7rem;
  }
}

.card-product-listing {
  background: $white;
  position: relative;
  padding: 1rem 0 0 8rem;

  h2 {
    a {
      color: $body-color;
    }
  }

  figure {
    position: absolute;
    left: 0;
    top: 0;
    width: 8rem;
    height: 8rem;

    a {
      display: block;
      position: relative;
    }

    :deep {
      img,
      svg {
        display: block;
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }
  }

  .product-actions {
    font-family: $font-family-lanekcut;
    line-height: 1.2;
    font-size: 2rem;

    > * {
      padding: 0 0.5rem;
      flex-grow: 1;
      text-align: center;
    }

    .price {
      border-top: 2px solid $border-color;
      border-left: 2px solid $border-color;
    }

    button {
      position: relative;
      margin: 0;
      border: 0;
      border-top: 2px solid $border-color;
      background: $bg-btn-yellow no-repeat center center / 100% auto;
      @include transition($transition-base);

      span {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        transform: translate(0, 0);
        font-size: 130%;

        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          @include rfs(2.2rem, width);
          @include rfs(2.2rem, height);
          margin-right: 1rem;
          background: escape-svg(
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1489.73 1486" fill="#{$dark}"><path d="M1489.67,1327.53,1438.93,152.62C1438.06,68,1368.59,0,1283.34,0h-1077C121.08,0,51.65,68,50.77,152.63L.06,1327.8c0,1-.06,2-.06,3C0,1416.3,69.8,1486,155.59,1486H1334.15c85.79,0,155.58-69.83,155.58-155.38,0-.95,0-2.14-.06-3.09M1334.15,1354H155.59a23.25,23.25,0,0,1-23.43-22.34L182.84,156.71c0-1,.06-1.51.06-2.46,0-12.69,10.28-22.25,23.41-22.25h1077c13.15,0,23.46,9.48,23.46,22.17,0,1,0,1.67.06,2.62l50.71,1175a23.14,23.14,0,0,1-23.42,22.22"/><path d="M965.5,256.6c-36.49,0-66.5,29.58-66.5,66.07V522.35c0,84.12-68.81,152.56-153.54,152.56S592,606.47,592,522.35V322.67a66,66,0,1,0-132,0V522.35c0,157,128.42,284.7,286,284.7s286-127.72,286-284.7V322.67c0-36.49-30-66.07-66.5-66.07"/></svg>')
            )
            no-repeat center center / 100% auto;
        }
      }

      &.done {
        span {
          @include transition(0.5s linear);
          transform: translate(50px, -50px);
          z-index: 1000;
          opacity: 0;
        }
      }
    }
  }

  @include media-breakpoint-up(xs) {
    padding-left: 12rem;

    figure {
      width: 12rem;
      height: 12rem;

      :deep {
        img,
        svg {
          width: 10rem;
          height: 10rem;
        }
      }
    }

    .product-actions {
      font-size: 2.2rem;
    }
  }

  @include media-breakpoint-up(sm) {
    @include padding(3rem 0 0);
    height: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    figure,
    .product-title,
    .product-description {
      @include padding-left(3rem);
      @include padding-right(3rem);
    }

    .product-title {
      margin-bottom: auto;
    }

    figure {
      position: static;
      margin: auto;
      width: 100%;
      height: 19rem;
      @include margin-top(3rem);
      @include margin-bottom(3rem);

      a {
        display: block;
        height: 100%;
      }

      :deep {
        svg,
        img {
          border-radius: 0;
          width: 100%;
          height: 100%;
        }
      }
    }

    .product-actions {
      width: 100%;
      @include font-size(3rem);
      @include margin-top(2rem);

      > * {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }

      .price {
        border-left: 0;
      }

      button {
        border-left: 2px solid $border-color;
        background: $bg-btn-yellow no-repeat center center / 0 0;

        &:hover {
          background-size: 100% 100px;

          &:before {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }
        }

        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          @include rfs(2.2rem, width);
          @include rfs(2.2rem, height);
          margin-right: 1rem;
          background: escape-svg(
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1489.73 1486" fill="#{$dark}"><path d="M1489.67,1327.53,1438.93,152.62C1438.06,68,1368.59,0,1283.34,0h-1077C121.08,0,51.65,68,50.77,152.63L.06,1327.8c0,1-.06,2-.06,3C0,1416.3,69.8,1486,155.59,1486H1334.15c85.79,0,155.58-69.83,155.58-155.38,0-.95,0-2.14-.06-3.09M1334.15,1354H155.59a23.25,23.25,0,0,1-23.43-22.34L182.84,156.71c0-1,.06-1.51.06-2.46,0-12.69,10.28-22.25,23.41-22.25h1077c13.15,0,23.46,9.48,23.46,22.17,0,1,0,1.67.06,2.62l50.71,1175a23.14,23.14,0,0,1-23.42,22.22"/><path d="M965.5,256.6c-36.49,0-66.5,29.58-66.5,66.07V522.35c0,84.12-68.81,152.56-153.54,152.56S592,606.47,592,522.35V322.67a66,66,0,1,0-132,0V522.35c0,157,128.42,284.7,286,284.7s286-127.72,286-284.7V322.67c0-36.49-30-66.07-66.5-66.07"/></svg>')
            )
            no-repeat center center / 100% auto;
        }
      }
    }
  }
  /*
  @include media-breakpoint-up(xl) {
    figure {
      :deep {
        img {
          @include transition($transition-base);
          filter: grayscale(1);
        }
      }
    }

    &:hover {
      figure {
        :deep {
          img {
            @include transition($transition-base);
            filter: grayscale(0);
          }
        }
      }
    }
  }
  */
}

.modal .card-product-listing {
  @include media-breakpoint-between(xxs, xs) {
    padding-left: 6rem;

    figure {
      width: 6rem;
      height: 6rem;

      :deep {
        img {
          width: 5rem;
          height: 5rem;
        }
      }
    }
  }

  @include media-breakpoint-between(xs, sm) {
    padding-left: 10rem;

    figure {
      width: 10rem;
      height: 10rem;

      :deep {
        img {
          width: 8rem;
          height: 8rem;
        }
      }
    }
  }
}

.product-single {
  display: flex;
  flex-direction: column;
  position: relative;

  &.has-custom-discount {
    .product-custom-discount-badge {
      top: 2rem;
      right: 2rem;
    }

    @include media-breakpoint-up(md) {
      h2,
      .product-description :deep p {
        padding-right: 6.2rem;
      }
    }
  }

  h2 {
    font-size: 5.6rem;
  }

  h3 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  figure {
    position: relative;
    order: 0;
    width: 74%;
    margin: 0 auto 2rem;
    background: $bg-single-product-splash no-repeat center center / 100% 100%;

    &:before {
      content: "";
      padding-top: 100%;
    }

    :deep {
      img {
        width: calc(100% - 3rem);
        height: calc(100% - 3rem);
        object-fit: cover;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .product-title {
    order: 1;
    position: relative;
    text-align: center;
  }

  .product-description {
    max-width: 100%;
    order: 2;
    position: relative;
    text-align: center;
    @include margin-bottom(3.5rem);

    &:after {
      content: "";
      display: block;
      height: 2px;
      background-image: linear-gradient(
        to right,
        $body-color 8px,
        transparent 8px
      );
      background-size: 15px 2px;
      margin-top: 2.5rem;
    }
  }

  .extra-wrap {
    margin-bottom: 2rem;
  }

  .extra-name {
    span {
      color: $gray-500;
    }
  }

  .single-product-actions {
    order: 3;
  }

  .single-product-add {
    display: flex;
    font-family: $font-family-lanekcut;
    line-height: 0.8;
    font-size: 2.6rem;
    @include global-border;
    margin-top: 3rem;

    > * {
      padding: 1rem;
      flex-grow: 1;
      text-align: center;
    }

    button {
      position: relative;
      margin: 0;
      background: none;
      border: 0;
      background: $bg-btn-yellow no-repeat center center / 100% auto;
      @include transition($transition-base);

      span {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        transform: translate(0, 0);
        font-size: 130%;

        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          @include rfs(2.2rem, width);
          @include rfs(2.2rem, height);
          margin-right: 1rem;
          background: escape-svg(
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1489.73 1486" fill="#{$dark}"><path d="M1489.67,1327.53,1438.93,152.62C1438.06,68,1368.59,0,1283.34,0h-1077C121.08,0,51.65,68,50.77,152.63L.06,1327.8c0,1-.06,2-.06,3C0,1416.3,69.8,1486,155.59,1486H1334.15c85.79,0,155.58-69.83,155.58-155.38,0-.95,0-2.14-.06-3.09M1334.15,1354H155.59a23.25,23.25,0,0,1-23.43-22.34L182.84,156.71c0-1,.06-1.51.06-2.46,0-12.69,10.28-22.25,23.41-22.25h1077c13.15,0,23.46,9.48,23.46,22.17,0,1,0,1.67.06,2.62l50.71,1175a23.14,23.14,0,0,1-23.42,22.22"/><path d="M965.5,256.6c-36.49,0-66.5,29.58-66.5,66.07V522.35c0,84.12-68.81,152.56-153.54,152.56S592,606.47,592,522.35V322.67a66,66,0,1,0-132,0V522.35c0,157,128.42,284.7,286,284.7s286-127.72,286-284.7V322.67c0-36.49-30-66.07-66.5-66.07"/></svg>')
            )
            no-repeat center center / 100% auto;
        }
      }

      &.done {
        span {
          @include transition(0.5s linear);
          transform: translate(50px, -50px);
          z-index: 1000;
          opacity: 0;
        }
      }
    }
  }

  @include media-breakpoint-up(sm) {
    .product-description {
      margin-bottom: 0;
    }
    .single-product-extras-actions {
      display: flex;
      position: relative;

      &:after {
        content: "";
        display: block;
        height: 2px;
        background-image: linear-gradient(
          to right,
          $body-color 8px,
          transparent 8px
        );
        background-size: 15px 2px;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }

    .extra-name {
      max-width: 200px;
    }

    .extra-wrap {
      padding-top: 2.5rem;
      flex-grow: 1;
      margin-bottom: 0;
      padding-bottom: 2.5rem;

      &:last-child {
        display: flex;
        align-items: flex-end;

        &:not(:first-child) {
          @include padding-left(3rem);
          @include margin-left(2rem);
          position: relative;

          &:before {
            content: "";
            display: block;
            width: 2px;
            background-image: linear-gradient(
              to bottom,
              $body-color 8px,
              transparent 8px
            );
            background-size: 2px 15px;
            height: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
          }
        }
      }
    }

    .single-product-add {
      @include font-size(3rem);
    }

    .single-product-add {
      button {
        &:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          @include rfs(2.2rem, width);
          @include rfs(2.2rem, height);
          margin-right: 1rem;
          background: escape-svg(
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1489.73 1486" fill="#{$dark}"><path d="M1489.67,1327.53,1438.93,152.62C1438.06,68,1368.59,0,1283.34,0h-1077C121.08,0,51.65,68,50.77,152.63L.06,1327.8c0,1-.06,2-.06,3C0,1416.3,69.8,1486,155.59,1486H1334.15c85.79,0,155.58-69.83,155.58-155.38,0-.95,0-2.14-.06-3.09M1334.15,1354H155.59a23.25,23.25,0,0,1-23.43-22.34L182.84,156.71c0-1,.06-1.51.06-2.46,0-12.69,10.28-22.25,23.41-22.25h1077c13.15,0,23.46,9.48,23.46,22.17,0,1,0,1.67.06,2.62l50.71,1175a23.14,23.14,0,0,1-23.42,22.22"/><path d="M965.5,256.6c-36.49,0-66.5,29.58-66.5,66.07V522.35c0,84.12-68.81,152.56-153.54,152.56S592,606.47,592,522.35V322.67a66,66,0,1,0-132,0V522.35c0,157,128.42,284.7,286,284.7s286-127.72,286-284.7V322.67c0-36.49-30-66.07-66.5-66.07"/></svg>')
            )
            no-repeat center center / 100% auto;
        }

        &:before {
          @include transition($transition-base);
        }

        &:hover {
          &:before {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }
        }
      }
    }
  }

  @include media-breakpoint-up(md) {
    background: $body-bg;
    position: relative;
    padding-left: calc(50% - 2px);

    figure {
      margin: 0;
      position: absolute;
      left: 0;
      top: 0;
      width: calc(50% - 2px);
      height: 100%;
      background: none;

      :deep {
        img {
          border-radius: 0;
          width: 100%;
          height: 100%;
        }
      }
    }

    .product-title {
      @include padding(4rem 3rem 0);
      text-align: left;
    }

    .product-description {
      text-align: left;

      > * {
        @include padding(0 3rem);
      }

      :deep {
        p {
          margin-bottom: 1rem;
        }
      }
    }

    .single-product-add,
    .single-product-quantity-wrap,
    .single-product-extras-actions {
      @include padding(0 3rem);
    }

    .single-product-add {
      @include margin(4rem -3rem 0);
      border-right: 0;
      border-left: 0;
      border-bottom: 0;

      > * {
        flex-shrink: 1;
        flex-grow: 0;
        text-align: left;

        &:first-child {
          @include padding-left(3rem);
        }
      }

      button {
        @include padding-right(4rem);
        @include padding-left(4rem);
        text-align: center;
        margin-left: auto;
      }

      .price-tag {
        color: $gray-500;
      }
    }
  }
}
</style>
