<script setup>
import { useRoute, useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import FormLogin from "@/components/form/FormLogin.vue";
import FormRegistration from "@/components/form/FormRegistration.vue";
import FormResetPass from "@/components/form/FormResetPass.vue";
import FormPassRecovery from "@/components/form/FormPassRecovery.vue";
import UserOrders from "@/components/partials/UserOrders.vue";
import UserAddresses from "@/components/partials/UserAddresses.vue";
import UserGeneral from "@/components/partials/UserGeneral.vue";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";
import { inject } from "vue";

const route = useRoute();
const router = useRouter();
const store = useOlivStore();

const showUserMenuItems = inject("showUserMenuItems");

if (route.query.action === "aa") {
  store
    .userActions(
      "activate",
      route.query.login,
      route.query.login,
      false,
      route.query.key
    )
    .then(() => {
      if (store.userData.loggedIn) {
        router.push({ path: "/meniu" });
      }
    });
}
</script>
<template>
  <div class="container">
    <UpdateLoading />
    <div
      class="activation-container"
      v-show="route.query.action === 'aa' && !store.userData.loggedIn"
    >
      <div v-if="!store.userData.error">
        <h3>Se activeaza contul</h3>
      </div>
      <div v-if="store.userData.error">
        <h5>{{ store.userData.error }}</h5>
      </div>
    </div>

    <div v-if="store.userData.loggedIn">
      <div v-for="(menuItem, slug) in showUserMenuItems" :key="slug">
        <UserOrders v-if="slug === 'orders' && menuItem.show" />
        <UserAddresses v-if="slug === 'addresses' && menuItem.show" />
        <UserGeneral v-if="slug === 'general' && menuItem.show" />
      </div>
    </div>

    <div
      v-if="
        !store.userData.loggedIn &&
        ['create', 'reset', 'rp', 'aa'].indexOf(route.query.action) === -1
      "
    >
      <h2>Intra in cont</h2>
      <FormLogin />
    </div>

    <div v-if="!store.userData.loggedIn && route.query.action === 'create'">
      <h2>Creeaza-ti cont in cateva secunde!</h2>
      <FormRegistration />
    </div>

    <div v-if="!store.userData.loggedIn && route.query.action === 'reset'">
      <h2>Reseteaza parola</h2>
      <FormResetPass />
    </div>

    <div
      class="recovery-form"
      v-show="!store.userData.loggedIn && route.query.action === 'rp'"
    >
      <p>Introdu parola noua:</p>
      <FormPassRecovery />
    </div>
  </div>
</template>
