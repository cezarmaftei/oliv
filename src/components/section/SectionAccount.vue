<script setup>
import { useRoute, useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import FormLogin from "@/components/form/FormLogin.vue";
import FormRegistration from "@/components/form/FormRegistration.vue";
import FormResetPass from "@/components/form/FormResetPass.vue";
import FormPassRecovery from "@/components/form/FormPassRecovery.vue";
import UpdateLoading from "@/components/partials/UpdateLoading.vue";

const route = useRoute();
const router = useRouter();
const store = useOlivStore();

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
  <div class="overflow-hidden container mb-8">
    <UpdateLoading />
    <div
      class="activation-container"
      v-show="route.query.action === 'aa' && !store.userData.loggedIn"
    >
      <div v-if="!store.userData.error">
        <h3 class="mb-2">Se activeaza contul</h3>
      </div>
      <div v-if="store.userData.error">
        <h5>{{ store.userData.error }}</h5>
      </div>
    </div>

    <div v-if="store.userData.loggedIn">
      <router-link to="/contul-meu/comenzile-mele/"
        >Istoric comenzi</router-link
      >
      <router-link to="/contul-meu/adresele-mele/">Adresele mele</router-link>
      <router-link to="/contul-meu/detalii-cont/">Detalii cont</router-link>
      <button
        type="button"
        class="btn btn-outline-dark"
        @click="store.userActions('logout')"
      >
        Logout
      </button>
    </div>

    <div
      v-if="
        !store.userData.loggedIn &&
        !['create', 'reset', 'rp', 'aa'].includes(route.query.action)
      "
    >
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Intra in contul tau</h3>
        <FormLogin />
      </div>
    </div>

    <div v-if="!store.userData.loggedIn && route.query.action === 'create'">
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Creeaza-ti cont in cateva secunde!</h3>
        <FormRegistration />
      </div>
    </div>

    <div v-if="!store.userData.loggedIn && route.query.action === 'reset'">
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Resetaza parola</h3>
        <FormResetPass />
      </div>
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

<style scoped lang="scss">
h3 {
  font-size: 3rem;

  @include media-breakpoint-up(sm) {
    font-size: 4rem;
  }
}

.container {
  padding: 0;
}

:deep {
  .btn {
    padding: 1rem 2rem;
  }

  a {
    color: $body-color;

    &:hover {
      color: $olive;
    }
  }
}

.form-outer-wrapper {
  background: $white;
  border: 2px solid $border-color;
  max-width: 40rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
}

@include media-breakpoint-up(md) {
  .container {
    border: 2px solid $border-color;
    @include padding(7rem);
  }
}
</style>
