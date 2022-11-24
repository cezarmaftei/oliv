<script setup>
import ItemPrice from "@/components/partials/ItemPrice.vue";
import ProductOrder from "../product/ProductOrder.vue";

import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps(["order"]);

const dateToLocale = (dateString) => {
  let date = new Date(dateString);
  return date.toLocaleDateString("ro-RO");
};
</script>

<template>
  <div class="card card-order">
    <div class="order-header mb-2">
      <h4 class="mb-0">
        Comanda #{{ order.id }} -
        <span v-if="order.date_completed">{{
          dateToLocale(order.date_completed)
        }}</span
        ><span v-else>{{ dateToLocale(order.date_created) }}</span>
      </h4>
    </div>
    <div class="order-body">
      <div class="order-products">
        <div
          class="order-product"
          v-for="product in store.getReorder(order.meta_data)"
          :key="product"
        >
          <ProductOrder :product="product" />
        </div>
      </div>
      <div class="order-totals text-end">
        <div class="order-subtotal h5 mb-2 d-flex">
          <div>Subtotal</div>
          <div class="ms-auto">
            <ItemPrice
              :price="
                parseFloat(order.total) +
                parseFloat(order.discount_total) -
                parseFloat(order.shipping_total)
              "
            />
          </div>
        </div>
        <div class="order-coupons h5 mb-2" v-if="order.coupon_lines.length">
          <div
            class="order-coupon d-flex"
            v-for="coupon in order.coupon_lines"
            :key="coupon"
          >
            <div>Coupon "{{ coupon.code }}" discount:</div>
            <div class="ms-auto"><ItemPrice :price="coupon.discount" /></div>
          </div>
        </div>
        <div class="d-flex h5 mb-2" v-if="parseFloat(order.shipping_total) > 0">
          <div class="me-1">Cost livrare:</div>
          <div class="ms-auto">
            <ItemPrice :price="parseFloat(order.shipping_total)" />
          </div>
        </div>
        <div class="order-total h4 d-flex">
          <div>Total</div>
          <div class="ms-auto">
            <ItemPrice :price="order.total" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
