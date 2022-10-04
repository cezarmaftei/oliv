<script setup>
import ItemPrice from "@/components/partials/ItemPrice.vue";
import ProductOrder from "../product/ProductOrder.vue";

defineProps({
  order: Object,
});

const dateToLocale = (dateString) => {
  let date = new Date(dateString);
  return date.toLocaleDateString("ro-RO");
};
</script>

<template>
  <div class="card card-order">
    <div class="order-header">
      <h3>
        Comanda #{{ order.id }} -
        <span v-if="order.date_completed">{{
          dateToLocale(order.date_completed)
        }}</span
        ><span v-else>{{ dateToLocale(order.date_created) }}</span>
      </h3>
    </div>

    <div class="order-body">
      <div class="order-products">
        <div
          class="order-product"
          v-for="product in order.line_items"
          :key="product"
        >
          <ProductOrder :product="product" />
        </div>
      </div>
      <div class="order-totals text-end">
        <div class="order-subtotal d-flex">
          <div>Subtotal</div>
          <div><ItemPrice :price="order.total" /></div>
        </div>
        <div class="order-coupons" v-if="order.coupon_lines.length">
          <div
            class="order-coupon d-flex"
            v-for="coupon in order.coupon_lines"
            :key="coupon"
          >
            <div>Coupon "{{ coupon.code }}" discount:</div>
            <div>{{ coupon.discount }}</div>
          </div>
        </div>
        <div class="order-total d-flex">
          <div>Total</div>
          <div>
            {{ parseFloat(order.total) + parseFloat(order.discount_total) }}lei
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
