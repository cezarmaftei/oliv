<script setup>
import OrderDetails from "@/components/partials/OrderDetails.vue";
import { useOlivStore } from "@/stores/oliv.js";
import ItemPrice from "../partials/ItemPrice.vue";

const store = useOlivStore();

const dateToLocale = (dateString) => {
  let date = new Date(dateString);
  return date.toLocaleDateString("ro-RO");
};

const orderTotalItems = (items) => {
  let total = 0;
  items.forEach((item) => {
    total += parseInt(item.quantity);
  });

  return total;
};
</script>
<template>
  <div class="p-7">
    <h3>Istoric Comenzi</h3>
    <div v-if="store.getUserOrders.length > 0">
      <table>
        <thead class="d-none d-lg-table-row">
          <th>Numarul Comenzii</th>
          <th>Data</th>
          <th>Status</th>
          <th>Total</th>
          <th>Actiuni</th>
        </thead>
        <tbody>
          <tr
            class="d-block d-lg-table-row user-order p-4 mb-5"
            v-for="order in store.getUserOrders"
            :key="order"
          >
            <td class="d-block d-lg-table-cell">
              <span class="d-lg-none">Numarul Comenzii: </span>#{{ order.id }}
            </td>
            <td class="d-block d-lg-table-cell">
              <span class="d-lg-none">Data: </span>
              <span v-if="order.date_completed">{{
                dateToLocale(order.date_completed)
              }}</span
              ><span v-else>{{ dateToLocale(order.date_created) }}</span>
            </td>
            <td class="d-block d-lg-table-cell">
              <span class="d-lg-none">Status: </span>
              {{ order.status }}
            </td>
            <td class="d-block d-lg-table-cell">
              <span class="d-lg-none">Pret: </span>
              <ItemPrice
                :price="
                  (
                    store.toFloat(order.total) +
                    store.toFloat(order.discount_total)
                  ).toFixed(2)
                "
              />
              pentru {{ orderTotalItems(order.line_items) }} produs<span
                v-if="orderTotalItems(order.line_items) > 1"
                >e</span
              >
            </td>
            <td class="d-block d-lg-table-cell">
              <button type="button" class="btn btn-outline-dark">
                detalii comanda
              </button>
              <button type="button" class="btn btn-outline-dark">
                comanda din nou
              </button>
            </td>
            <!-- <OrderDetails :order="order" /> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      Nu ai plasat nici o comanda inca.
      <router-link to="/meniu">Vezi meniul!</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-order {
  border: 1px solid $black;
}
</style>
