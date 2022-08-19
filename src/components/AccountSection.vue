<script setup>
import { useRoute } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import FormLogin from "@/components/partials/FormLogin.vue";
import FormRegistration from "@/components/partials/FormRegistration.vue";
import FormResetPass from "@/components/partials/FormResetPass.vue";
import FormPassRecovery from "@/components/partials/FormPassRecovery.vue";
import UserOrders from "@/components/partials/UserOrders.vue";
import UserAddresses from "@/components/partials/UserAddresses.vue";
import UserGeneral from "@/components/partials/UserGeneral.vue";
import { inject } from "vue";

const route = useRoute();
const store = useOlivStore();

const showUserMenuItems = inject("showUserMenuItems");
</script>
<template>
  <div class="container">
    <div v-if="store.userData.success">
      <div v-for="(menuItem, slug) in showUserMenuItems" :key="slug">
        <UserOrders v-if="slug === 'orders' && menuItem.show" />
        <UserAddresses v-if="slug === 'addresses' && menuItem.show" />
        <UserGeneral v-if="slug === 'general' && menuItem.show" />
      </div>
    </div>

    <div
      v-if="
        !store.userData.success &&
        ['create', 'reset', 'rp'].indexOf(route.query.action) === -1
      "
    >
      <h2>Intra in cont</h2>
      <FormLogin />
    </div>

    <div v-if="!store.userData.success && route.query.action === 'create'">
      <h2>Creeaza-ti cont in cateva secunde!</h2>
      <FormRegistration />
    </div>

    <div v-if="!store.userData.success && route.query.action === 'reset'">
      <h2>Reseteaza parola</h2>
      <FormResetPass />
    </div>

    <div
      class="recovery-form"
      v-show="!store.userData.success && route.query.action === 'rp'"
    >
      <p>Introdu parola noua:</p>
      <FormPassRecovery />
    </div>
  </div>
</template>
