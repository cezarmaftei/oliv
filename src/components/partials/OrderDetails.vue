<script setup>
import ItemPrice from "@/components/partials/ItemPrice.vue";
import ProductOrder from "../product/ProductOrder.vue";

import { useOlivStore } from "@/stores/oliv.js";
const store = useOlivStore();

defineProps({
  order: Object,
});

// Debug pentru /comanda-plasata
// const order = {
//   id: 5266,
//   parent_id: 0,
//   status: "processing",
//   currency: "RON",
//   version: "6.9.4",
//   prices_include_tax: false,
//   date_created: "2022-10-05T11:01:14",
//   date_modified: "2022-10-05T11:01:14",
//   discount_total: "249.00",
//   discount_tax: "0.00",
//   shipping_total: "0.00",
//   shipping_tax: "0.00",
//   cart_tax: "0.00",
//   total: "249.00",
//   total_tax: "0.00",
//   customer_id: 0,
//   order_key: "wc_order_tqyimJyAPXfUD",
//   billing: {
//     first_name: "",
//     last_name: "",
//     company: "",
//     address_1: "",
//     address_2: "",
//     city: "",
//     state: "",
//     postcode: "",
//     country: "",
//     email: "",
//     phone: "",
//   },
//   shipping: {
//     first_name: "",
//     last_name: "",
//     company: "",
//     address_1: "",
//     address_2: "",
//     city: "",
//     state: "",
//     postcode: "",
//     country: "",
//     phone: "",
//   },
//   payment_method: "cash",
//   payment_method_title: "cash la livrare",
//   transaction_id: "",
//   customer_ip_address: "",
//   customer_user_agent: "",
//   created_via: "rest-api",
//   customer_note: "AS vrea sa cantati lambada",
//   date_completed: null,
//   date_paid: "2022-10-05T11:01:14",
//   cart_hash: "",
//   number: "5266",
//   meta_data: [
//     { id: 204619, key: "order_extras_cutlery", value: "Doresc tacamuri" },
//     {
//       id: 204620,
//       key: "pickup",
//       value: "Comanda va fi ridicata de client de la sediu!",
//     },
//     {
//       id: 204621,
//       key: "shipping",
//       value: {
//         shipping_first_name: { name: "Nume si Prenume", value: "Cezar" },
//         shipping_email: { name: "Email", value: "cezar.maftei@gmail.com" },
//         shipping_phone: { name: "Telefon", value: "+40737043930" },
//         shipping_address_1: { name: "Adresa", value: "" },
//         shipping_city: { name: "Oras/Localitate", value: "" },
//         shipping_country: { name: "Tara", value: "Romania" },
//         shipping_state: { name: "Judet/Sector", value: "Iasi" },
//         shipping_distance: {
//           name: "Distanta de la sediu pana la client",
//           value: "",
//         },
//       },
//     },
//     {
//       id: 204622,
//       key: "reorder_items",
//       value: [
//         {
//           id: 47,
//           name: "Meniu Mr. Bean",
//           thumbId: 48,
//           productWeight: "570g",
//           productQty: 6,
//           productPrice: "38",
//           productExtras: [
//             {
//               _id: "exwo-id5085177272",
//               extraName: "Extra Gouda (30g) la Taco",
//               extraQty: 3,
//               extraPrice: "4",
//             },
//             {
//               _id: "exwo-id4405273242",
//               extraName: "Extra Gouda (30g) la Cartofi",
//               extraQty: 3,
//               extraPrice: "4",
//             },
//           ],
//           productWithExtrasPrice: 62,
//           itemTotal: 372,
//         },
//         {
//           id: 129,
//           name: "Dulceata de ardei iuti",
//           thumbId: 127,
//           productWeight: "40g",
//           productQty: 2,
//           productPrice: "5",
//           productExtras: [],
//           productWithExtrasPrice: 5,
//           itemTotal: 10,
//         },
//         {
//           id: 128,
//           name: "Sos de iaurt",
//           thumbId: 127,
//           productWeight: "40g",
//           productQty: 1,
//           productPrice: "5",
//           productExtras: [],
//           productWithExtrasPrice: 5,
//           itemTotal: 5,
//         },
//         {
//           id: 154,
//           name: "Vitamin Aqua Ca Zero",
//           thumbId: 155,
//           productWeight: "600ml",
//           productQty: 1,
//           productPrice: "10",
//           productExtras: [],
//           productWithExtrasPrice: 10,
//           itemTotal: 10,
//         },
//         {
//           id: 83,
//           name: "Taculet cu pui",
//           thumbId: 85,
//           productWeight: "110g",
//           productQty: 1,
//           productPrice: "14",
//           productExtras: [
//             {
//               _id: "exwo-id5254819130",
//               extraName: "Extra Gouda (10g) la Taculet",
//               extraQty: 3,
//               extraPrice: "4",
//             },
//           ],
//           productWithExtrasPrice: 26,
//           itemTotal: 26,
//         },
//         {
//           id: 71,
//           name: "Meat Me Taco",
//           thumbId: 72,
//           productWeight: "340g",
//           productQty: 1,
//           productPrice: "28",
//           productExtras: [
//             {
//               _id: "exwo-id9680789371",
//               extraName: "Extra Gouda (30g) la Taco",
//               extraQty: 2,
//               extraPrice: "4",
//             },
//           ],
//           productWithExtrasPrice: 36,
//           itemTotal: 36,
//         },
//         {
//           id: 74,
//           name: "Flying Taco",
//           thumbId: 75,
//           productWeight: "310g",
//           productQty: 1,
//           productPrice: "27",
//           productExtras: [
//             {
//               _id: "exwo-id3661071476",
//               extraName: "Extra Gouda (30g) la Taco",
//               extraQty: 3,
//               extraPrice: "4",
//             },
//           ],
//           productWithExtrasPrice: 39,
//           itemTotal: 39,
//         },
//       ],
//     },
//     { id: 204629, key: "_new_order_email_sent", value: "true" },
//   ],
//   line_items: [
//     {
//       id: 16265,
//       name: "Meniu Mr. Bean",
//       product_id: 47,
//       variation_id: 0,
//       quantity: 6,
//       tax_class: "",
//       subtotal: "372.00",
//       subtotal_tax: "0.00",
//       total: "186.00",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [
//         {
//           id: 116345,
//           key: "Extra Gouda (30g) la Taco(x 4lei)",
//           value: "3",
//           display_key: "Extra Gouda (30g) la Taco(x 4lei)",
//           display_value: "3",
//         },
//         {
//           id: 116346,
//           key: "Extra Gouda (30g) la Cartofi(x 4lei)",
//           value: "3",
//           display_key: "Extra Gouda (30g) la Cartofi(x 4lei)",
//           display_value: "3",
//         },
//         {
//           id: 116347,
//           key: "api_exoptions",
//           value: [
//             { name: "Extra Gouda (30g) la Taco", value: 3, price: "4" },
//             { name: "Extra Gouda (30g) la Cartofi", value: 3, price: "4" },
//           ],
//           display_key: "api_exoptions",
//           display_value: [
//             { name: "Extra Gouda (30g) la Taco", value: 3, price: "4" },
//             { name: "Extra Gouda (30g) la Cartofi", value: 3, price: "4" },
//           ],
//         },
//       ],
//       sku: "",
//       price: 31,
//       image: {
//         id: "48",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Meniu-Mr.-Bean.jpg",
//       },
//       parent_name: null,
//     },
//     {
//       id: 16266,
//       name: "Dulceata de ardei iuti",
//       product_id: 129,
//       variation_id: 0,
//       quantity: 2,
//       tax_class: "",
//       subtotal: "10.00",
//       subtotal_tax: "0.00",
//       total: "5.00",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [],
//       sku: "",
//       price: 2.5,
//       image: {
//         id: "127",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Extra-sos-uri-scaled-1.jpg",
//       },
//       parent_name: null,
//     },
//     {
//       id: 16267,
//       name: "Sos de iaurt",
//       product_id: 128,
//       variation_id: 0,
//       quantity: 1,
//       tax_class: "",
//       subtotal: "5.00",
//       subtotal_tax: "0.00",
//       total: "2.50",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [],
//       sku: "",
//       price: 2.5,
//       image: {
//         id: "127",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Extra-sos-uri-scaled-1.jpg",
//       },
//       parent_name: null,
//     },
//     {
//       id: 16268,
//       name: "Vitamin Aqua Ca Zero",
//       product_id: 154,
//       variation_id: 0,
//       quantity: 1,
//       tax_class: "",
//       subtotal: "10.00",
//       subtotal_tax: "0.00",
//       total: "5.00",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [],
//       sku: "",
//       price: 5,
//       image: {
//         id: "155",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Vitamin_Aqua_Ca-1-1.jpg",
//       },
//       parent_name: null,
//     },
//     {
//       id: 16269,
//       name: "Taculet cu pui",
//       product_id: 83,
//       variation_id: 0,
//       quantity: 1,
//       tax_class: "",
//       subtotal: "26.00",
//       subtotal_tax: "0.00",
//       total: "13.00",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [
//         {
//           id: 116384,
//           key: "Extra Gouda (10g) la Taculet(x 4lei)",
//           value: "3",
//           display_key: "Extra Gouda (10g) la Taculet(x 4lei)",
//           display_value: "3",
//         },
//         {
//           id: 116385,
//           key: "api_exoptions",
//           value: [
//             { name: "Extra Gouda (10g) la Taculet", value: 3, price: "4" },
//           ],
//           display_key: "api_exoptions",
//           display_value: [
//             { name: "Extra Gouda (10g) la Taculet", value: 3, price: "4" },
//           ],
//         },
//       ],
//       sku: "",
//       price: 13,
//       image: {
//         id: "85",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Taculet-cu-pui.jpg",
//       },
//       parent_name: null,
//     },
//     {
//       id: 16270,
//       name: "Meat Me Taco",
//       product_id: 71,
//       variation_id: 0,
//       quantity: 1,
//       tax_class: "",
//       subtotal: "36.00",
//       subtotal_tax: "0.00",
//       total: "18.00",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [
//         {
//           id: 116395,
//           key: "Extra Gouda (30g) la Taco(x 4lei)",
//           value: "2",
//           display_key: "Extra Gouda (30g) la Taco(x 4lei)",
//           display_value: "2",
//         },
//         {
//           id: 116396,
//           key: "api_exoptions",
//           value: [{ name: "Extra Gouda (30g) la Taco", value: 2, price: "4" }],
//           display_key: "api_exoptions",
//           display_value: [
//             { name: "Extra Gouda (30g) la Taco", value: 2, price: "4" },
//           ],
//         },
//       ],
//       sku: "",
//       price: 18,
//       image: {
//         id: "72",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Meniu-Meat-Me-2.jpg",
//       },
//       parent_name: null,
//     },
//     {
//       id: 16271,
//       name: "Flying Taco",
//       product_id: 74,
//       variation_id: 0,
//       quantity: 1,
//       tax_class: "",
//       subtotal: "39.00",
//       subtotal_tax: "0.00",
//       total: "19.50",
//       total_tax: "0.00",
//       taxes: [],
//       meta_data: [
//         {
//           id: 116406,
//           key: "Extra Gouda (30g) la Taco(x 4lei)",
//           value: "3",
//           display_key: "Extra Gouda (30g) la Taco(x 4lei)",
//           display_value: "3",
//         },
//         {
//           id: 116407,
//           key: "api_exoptions",
//           value: [{ name: "Extra Gouda (30g) la Taco", value: 3, price: "4" }],
//           display_key: "api_exoptions",
//           display_value: [
//             { name: "Extra Gouda (30g) la Taco", value: 3, price: "4" },
//           ],
//         },
//       ],
//       sku: "",
//       price: 19.5,
//       image: {
//         id: "75",
//         src: "https://new-site.olivbistro.ro/wp-content/uploads/2022/05/Flying-Taco.jpg",
//       },
//       parent_name: null,
//     },
//   ],
//   tax_lines: [],
//   shipping_lines: [],
//   fee_lines: [],
//   coupon_lines: [
//     {
//       id: 16272,
//       code: "vlad50",
//       discount: "249",
//       discount_tax: "0",
//       meta_data: [
//         {
//           id: 116410,
//           key: "coupon_data",
//           value: {
//             id: 40,
//             code: "vlad50",
//             amount: "50",
//             status: "publish",
//             date_created: {
//               date: "2022-05-17 06:22:51.000000",
//               timezone_type: 1,
//               timezone: "+00:00",
//             },
//             date_modified: {
//               date: "2022-05-17 06:23:03.000000",
//               timezone_type: 1,
//               timezone: "+00:00",
//             },
//             date_expires: null,
//             discount_type: "percent",
//             description: "",
//             usage_count: 22,
//             individual_use: false,
//             product_ids: [],
//             excluded_product_ids: [],
//             usage_limit: 0,
//             usage_limit_per_user: 0,
//             limit_usage_to_x_items: null,
//             free_shipping: false,
//             product_categories: [],
//             excluded_product_categories: [],
//             exclude_sale_items: false,
//             minimum_amount: "",
//             maximum_amount: "",
//             email_restrictions: [],
//             virtual: false,
//             meta_data: [],
//           },
//           display_key: "coupon_data",
//           display_value: {
//             id: 40,
//             code: "vlad50",
//             amount: "50",
//             status: "publish",
//             date_created: {
//               date: "2022-05-17 06:22:51.000000",
//               timezone_type: 1,
//               timezone: "+00:00",
//             },
//             date_modified: {
//               date: "2022-05-17 06:23:03.000000",
//               timezone_type: 1,
//               timezone: "+00:00",
//             },
//             date_expires: null,
//             discount_type: "percent",
//             description: "",
//             usage_count: 22,
//             individual_use: false,
//             product_ids: [],
//             excluded_product_ids: [],
//             usage_limit: 0,
//             usage_limit_per_user: 0,
//             limit_usage_to_x_items: null,
//             free_shipping: false,
//             product_categories: [],
//             excluded_product_categories: [],
//             exclude_sale_items: false,
//             minimum_amount: "",
//             maximum_amount: "",
//             email_restrictions: [],
//             virtual: false,
//             meta_data: [],
//           },
//         },
//       ],
//     },
//   ],
//   refunds: [],
//   payment_url:
//     "https://new-site.olivbistro.ro/finalizare/order-pay/5266/?pay_for_order=true&key=wc_order_tqyimJyAPXfUD",
//   is_editable: false,
//   needs_payment: false,
//   needs_processing: true,
//   date_created_gmt: "2022-10-05T11:01:14",
//   date_modified_gmt: "2022-10-05T11:01:14",
//   date_completed_gmt: null,
//   date_paid_gmt: "2022-10-05T11:01:14",
//   currency_symbol: "lei",
//   _links: {
//     self: [
//       { href: "https://new-site.olivbistro.ro/wp-json/wc/v3/orders/5266" },
//     ],
//     collection: [
//       { href: "https://new-site.olivbistro.ro/wp-json/wc/v3/orders" },
//     ],
//   },
// };

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
          v-for="product in store.getReorder(order.meta_data)"
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
            <div><ItemPrice :price="coupon.discount" /></div>
          </div>
        </div>
        <div class="order-total d-flex">
          <div>Total</div>
          <div>
            <ItemPrice
              :price="
                parseFloat(order.total) + parseFloat(order.discount_total)
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
