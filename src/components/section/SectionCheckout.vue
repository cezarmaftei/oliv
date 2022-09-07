<script setup>
import { useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import CartContent from "@/components/partials/CartContent.vue";
import UserAddresses from "@/components/partials/UserAddresses.vue";
import PaymentMethods from "@/components/partials/PaymentMethods.vue";
import OrderExtras from "@/components/partials/OrderExtras.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";

const router = useRouter();
const store = useOlivStore();

/**
 * Send the order to Woo and redirect if success
 */
const sendOrder = async () => {
  await store.submitOrder().then((result) => {
    if (result === "productError") return;

    if (result) {
      router.push({
        name: "page",
        params: {
          slug: "comanda-plasata",
          orderData: JSON.stringify(result),
        },
      });
    } else {
      alert(
        `Ne pare rau, dar am intampinat o problema la inregistrarea comenzii. Incearca din nou in cateva secunde!`
      );
    }
  });
};
</script>

<template>
  <div class="container">
    <div v-if="store.cartData.items.length">
      <CartContent :isCheckout="true" />
      <UserAddresses :isCheckout="true" />
      <PaymentMethods v-if="store.cartData.addresses.shipping" />
      <OrderExtras v-if="store.cartData.paymentMethod" />
      <button
        @click="sendOrder()"
        class="btn btn-warning"
        v-if="store.cartData.paymentMethod"
      >
        Trimite comanda
      </button>
    </div>
    <NoProductsInCart v-else />
  </div>
</template>
