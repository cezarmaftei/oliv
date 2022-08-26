<script setup>
import ProductOrder from "@/components/partials/ProductOrder.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { computed } from "vue";

const store = useOlivStore();

const dateToLocale = (dateString) => {
  let date = new Date(dateString);
  return date.toLocaleDateString("ro-RO");
};

const getUserOrders = computed(() => {
  if (store.userData.customerOrdersData) {
    return store.userData.customerOrdersData.filter(
      (order) => order.status === "completed"
    );
  }
  return false;
});
</script>
<template>
  <h2>Comenzile Mele</h2>
  <div v-if="store.userData">
    <div v-if="getUserOrders.length">
      <div
        class="user-order p-4 mb-5"
        v-for="order in getUserOrders"
        :key="order"
      >
        <div class="order-header">
          <h3>
            <button>
              Comanda #{{ order.id }} -
              <span v-if="order.date_completed">{{
                dateToLocale(order.date_completed)
              }}</span
              ><span v-else>{{ dateToLocale(order.date_created) }}</span>
            </button>
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
              <div>{{ order.total }}lei</div>
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
                {{
                  parseFloat(order.total) + parseFloat(order.discount_total)
                }}lei
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      Nu ai plasat nici o comanda inca.
      <router-link to="/meniu">Vezi meniul!</router-link>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<style scoped lang="scss">
.user-order {
  border: 1px solid $black;
}
</style>
