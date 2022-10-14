<script setup>
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
import { Offcanvas } from "bootstrap";
import ItemPrice from "../partials/ItemPrice.vue";
import ModalOrderDetails from "../partials/ModalOrderDetails.vue";

const store = useOlivStore();
const currentOrder = ref(false);

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

const offCanvas = new Offcanvas("#cart-drawer");
const reorderItems = (order) => {
  const newCartItems = store.getReorder(order.meta_data);

  newCartItems.forEach((product) => {
    const storeProduct = store.storeData.products.filter(
      (p) => p.id === product.id
    )[0];

    // Set new price
    product.productPrice = storeProduct.price;

    if (product.productExtras.length > 0) {
      const storeProductExtras = store.getProductExtras(storeProduct);
      storeProductExtras.forEach((storeProductExtra) => {
        const productExtra = Object.values(product.productExtras).find(
          (value) => storeProductExtra._id === value._id
        );

        // console.log(
        //   `productExtra.extraPrice: ${productExtra.extraPrice} updated to storeProductExtra._price: ${storeProductExtra._price}`
        // );

        // Set new price
        productExtra.extraPrice = storeProductExtra._price;
      });
    }
  });

  store.cartData.items = newCartItems;

  offCanvas.show();
};
</script>
<template>
  <ModalOrderDetails
    @re-order="
      reorderItems(currentOrder ? currentOrder : store.getUserOrders[0])
    "
    v-if="store.getUserOrders.length"
    :order="currentOrder ? currentOrder : store.getUserOrders[0]"
  />
  <div class="py-7 px-5">
    <h3 class="mb-3">Istoric Comenzi</h3>
    <div v-if="store.getUserOrders.length > 0">
      <table>
        <thead class="d-none d-lg-table-row">
          <th>Nr</th>
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
              <span class="d-lg-none">Numarul Comenzii: </span>
              <span class="order-no">#{{ order.id }}</span>
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
                    parseFloat(order.total) + parseFloat(order.discount_total)
                  ).toFixed(2)
                "
              />
              pentru {{ orderTotalItems(order.line_items) }} produs<span
                v-if="orderTotalItems(order.line_items) > 1"
                >e</span
              >
            </td>
            <td class="d-block d-lg-table-cell">
              <button
                type="button"
                class="btn btn-outline-dark"
                @click="currentOrder = order"
                data-bs-toggle="modal"
                data-bs-target="#order-details-modal"
              >
                detalii comanda
              </button>
              <button
                type="button"
                class="btn btn-outline-dark"
                @click="reorderItems(order)"
              >
                comanda din nou
              </button>
            </td>
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
  border: 1px solid $gray-300;
}

.order-no {
  color: $gray-500;
}

table {
  font-family: $font-family-lanekcut;
  font-size: 2.2rem;
  line-height: 0.8;
}

td {
  border-bottom: 1px solid $gray-300;
  padding: 0.5rem 0;

  &:first-child {
    padding-top: 0;
    border-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}

.btn {
  width: 100%;
  margin-top: 1.5rem;
}

@include media-breakpoint-up(sm) {
  table {
    font-size: 2.6rem;
  }

  td {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .btn {
    width: auto;

    &:not(:first-child) {
      margin-left: 1.5rem;
    }
  }
}

@include media-breakpoint-up(lg) {
  table {
    width: 100%;
  }
  .user-order {
    border: 0;
  }

  th {
    font-weight: normal;
    white-space: nowrap;
  }

  th,
  td,
  td:first-child,
  td:last-child {
    @include padding(1.5rem 2rem);
    vertical-align: middle;
    border-bottom: 1px solid $gray-300;
  }

  td:not(:first-child) {
    position: relative;

    &:before {
      content: "";
      display: block;
      height: calc(100% - 3.6rem);
      width: 1px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: $gray-300;
    }
  }

  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
    margin-top: 0;

    &:not(:first-child) {
      margin-left: 0;
      margin-bottom: 0;
    }
  }
}

@include media-breakpoint-up(xl) {
  .btn {
    width: auto;
    margin: 0 1rem 0 0;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
