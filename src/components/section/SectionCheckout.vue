<script setup>
import { useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import CartContent from "@/components/cart/CartContent.vue";
import NoProductsInCart from "@/components/partials/NoProductsInCart.vue";
import { ref } from "vue";
import FieldsFormShipping from "../form/FieldsFormShipping.vue";
import FieldsFormBilling from "../form/FieldsFormBilling.vue";

const router = useRouter();
const store = useOlivStore();

const checkoutError = ref(false);
let billingAutofill = false;

const requestBilling = () => {
  if (
    !billingAutofill &&
    store.showBilling &&
    store.userData.customerAddresses.billing.length
  ) {
    store.cartData.addresses.billing = Object.assign(
      {},
      store.userData.customerAddresses.billing[0]
    );

    billingAutofill = true;
  }
};

/**
 * Send the order to Woo and redirect if success
 */
const sendOrder = async () => {
  if (store.userData.loggedIn && !store.userData.accountActive) return;

  const orderSubmit = await store.submitOrder().then((result) => result);

  if (orderSubmit === "productError") {
    document.getElementById("cart-summary").scrollIntoView();
    return;
  }

  if (orderSubmit && orderSubmit.checkoutError) {
    window.scrollTo(0, 0);
    checkoutError.value = orderSubmit.checkoutError;

    setTimeout(() => {
      checkoutError.value = false;
    }, 2000);

    return;
  }

  if (orderSubmit) {
    // Refresh account details
    store.loadCustomerData();

    router.push({
      name: "page",
      params: {
        slug: "comanda-plasata",
        orderData: JSON.stringify(orderSubmit),
      },
    });
  } else {
    alert(
      `Ne pare rau, dar am intampinat o problema la inregistrarea comenzii. Incearca din nou in cateva minute!`
    );
  }
};
</script>

<template>
  <div class="checkout-inner">
    <form @submit.prevent="sendOrder" v-if="store.cartData.items.length">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-7 pe-lg-5 pe-xl-0">
          <transition name="height-element-sm">
            <div v-if="checkoutError" class="bg-danger">
              <p class="p-2 text-light">
                {{ checkoutError }}
              </p>
            </div>
          </transition>

          <!-- Delivery method -->
          <div class="form-group">
            <h3>Optiuni de livrare</h3>
            <div class="row g-2">
              <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                <label class="form-control">
                  <input
                    type="checkbox"
                    true-value="pickup"
                    false-value="delivery"
                    v-model="store.cartData.deliveryMethod"
                    @change="store.updateCartTotals()"
                  />
                  Voi ridica eu comanda
                </label>
              </div>
              <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                <label class="form-control">
                  <input
                    type="checkbox"
                    v-model="store.cartData.orderExtras.cutlery.active"
                  />
                  {{ store.cartData.orderExtras.cutlery.title }}
                </label>
              </div>
            </div>
          </div>

          <FieldsFormShipping :isCheckout="true" />

          <label class="form-control form-link">
            <input
              type="checkbox"
              v-model="store.showBilling"
              @change="requestBilling()"
              :true-value="true"
              :false-value="false"
            />
            Vreau factura
          </label>

          <!-- Billing details -->
          <transition name="height-element">
            <div v-if="store.showBilling">
              <FieldsFormBilling :isCheckout="true" />
            </div>
          </transition>

          <!-- Payment Methods -->
          <transition name="height-element">
            <div v-if="store.cartData.deliveryMethod !== 'pickup'">
              <div class="form-group">
                <h3>Metoda de plata</h3>
                <div class="row g-2">
                  <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                    <label class="form-control">
                      <input
                        type="radio"
                        name="paymentMethod"
                        v-model="store.cartData.paymentMethod"
                        value="cash"
                        required
                      />
                      Cash la livrare
                    </label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-12 col-lg-6">
                    <label class="form-control">
                      <input
                        type="radio"
                        name="paymentMethod"
                        v-model="store.cartData.paymentMethod"
                        value="card"
                        required
                      />
                      Card la livrare
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <button
            type="submit"
            class="btn btn-primary reverse d-none d-md-block"
          >
            Trimite comanda
          </button>
        </div>
        <div
          class="col-12 col-md-6 col-lg-5 col-xl-4 ms-auto"
          id="cart-summary"
        >
          <div class="sticky-top sticky-spacing">
            <CartContent :isCheckout="true" />
          </div>
        </div>

        <div class="col-12 d-md-none">
          <button type="submit" class="btn btn-primary reverse">
            Trimite comanda
          </button>
        </div>
      </div>
    </form>
    <NoProductsInCart v-else />
  </div>
</template>
