<script setup>
import { useRoute, useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import UserOrders from "@/components/user-account/UserOrders.vue";
import UserAddresses from "@/components/user-account/UserAddresses.vue";
import UserGeneral from "@/components/user-account/UserGeneral.vue";
import FormLogin from "@/components/form/FormLogin.vue";
import FormRegistration from "@/components/form/FormRegistration.vue";
import FormResetPass from "@/components/form/FormResetPass.vue";
import FormPassRecovery from "@/components/form/FormPassRecovery.vue";
import IconTaco from "../icons/IconTaco.vue";
import IconMapMarkers from "../icons/IconMapMarkers.vue";
import IconNachos from "../icons/IconNachos.vue";
import PageNotFound from "../partials/PageNotFound.vue";
import { ref } from "vue";

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
        infoMessage.value = "Contul a fost activat cu succes!";
        store.userData.accountActive = true;

        setTimeout(() => {
          router.push({ name: "account" });
          infoMessage.value = false;
        }, 3000);
      }
    });
}

const logOutUser = () => {
  store.userActions("logout");
  router.push({ name: "account" });
};

const accountSections = {
  "comenzile-mele": UserOrders,
  "adresele-mele": UserAddresses,
  "detalii-cont": UserGeneral,
};

const infoMessage = ref(false);
const userActionPerformed = (message) => {
  infoMessage.value = message;

  setTimeout(() => {
    infoMessage.value = false;
    router.push({ name: "account" });
  }, 3000);
};
</script>
<template>
  <transition name="height-element-sm">
    <div v-show="infoMessage" class="user-actions-info-message">
      <div class="info-message info-message-lg">
        <p class="m-0" v-if="infoMessage">{{ infoMessage }}</p>
      </div>
    </div>
  </transition>

  <div
    v-if="!store.userData.loggedIn && !infoMessage"
    class="account-logged-out"
  >
    <div class="activation-container" v-show="route.query.action === 'aa'">
      <div v-if="!store.userData.error">
        <h3 class="mb-2">Se activeaza contul...</h3>
      </div>
      <div v-if="store.userData.error">
        <h5>{{ store.userData.error }}</h5>
      </div>
    </div>

    <div
      class="login-container"
      v-if="!['create', 'reset', 'rp', 'aa'].includes(route.query.action)"
    >
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Intra in contul tau</h3>
        <FormLogin />
      </div>
    </div>

    <div class="create-container" v-if="route.query.action === 'create'">
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Creeaza-ti cont in cateva secunde!</h3>
        <FormRegistration @registration-action="userActionPerformed" />
      </div>
    </div>

    <div class="reset-container" v-if="route.query.action === 'reset'">
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Resetaza parola</h3>
        <FormResetPass @recovery-email-sent="userActionPerformed" />
      </div>
    </div>

    <div class="recovery-container" v-show="route.query.action === 'rp'">
      <div class="form-outer-wrapper">
        <h3 class="mb-2">Introdu parola noua:</h3>
        <FormPassRecovery @password-recovered="userActionPerformed" />
      </div>
    </div>
  </div>

  <component
    v-else-if="store.userData.loggedIn && route.params.slug in accountSections"
    :is="accountSections[route.params.slug]"
  ></component>

  <div v-else-if="store.userData.loggedIn" class="account-menu text-center">
    <div class="row justify-content-center g-2">
      <div class="col-12 col-sm-6 col-lg-4">
        <router-link
          class="account-menu-card d-flex flex-column align-items-center justify-content-center pt-3"
          to="/contul-meu/comenzile-mele/"
          ><h3 class="mb-2 mt-auto">Istoric comenzi</h3>
          <IconTaco class="mb-3" />
          <span class="btn btn-primary reverse mt-auto"
            >vezi istoric comenzi</span
          ></router-link
        >
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <router-link
          class="account-menu-card d-flex flex-column align-items-center justify-content-center pt-3"
          to="/contul-meu/adresele-mele/"
          ><h3 class="mb-2 mt-auto">Adresele mele</h3>
          <IconMapMarkers class="mb-3" />
          <span class="btn btn-primary reverse mt-auto"
            >vezi adresele</span
          ></router-link
        >
      </div>
      <div class="col-12 col-sm-6 col-lg-4">
        <router-link
          class="account-menu-card d-flex flex-column align-items-center justify-content-center pt-3"
          to="/contul-meu/detalii-cont/"
          ><h3 class="mb-2 mt-auto">Detalii cont</h3>
          <IconNachos class="mb-3" />
          <span class="btn btn-primary reverse mt-auto"
            >vezi detalii cont</span
          ></router-link
        >
      </div>
    </div>
    <div class="d-flex flex-wrap justify-content-center"></div>
    <button type="button" class="btn btn-primary mt-4" @click="logOutUser">
      Logout
    </button>
  </div>

  <PageNotFound v-else-if="!infoMessage" />
</template>

<style scoped lang="scss">
h3 {
  font-size: 3rem;

  @include media-breakpoint-up(sm) {
    font-size: 4rem;
  }
}

.form-outer-wrapper {
  max-width: 40rem;

  @include media-breakpoint-up(sm) {
    background: $white;
    @include global-border;
    padding: 2rem;
    margin-left: auto;
    margin-right: auto;
  }
}

.account-menu-card {
  @include global-border;
  color: $body-color;
  height: 100%;

  &:hover {
    svg {
      transform: scale(1.1);
    }

    .btn {
      background-size: 0 0;
    }
  }

  .btn {
    margin: -2px;
    width: calc(100% + 4px);

    &:hover {
      background-size: 500px 500px;
    }
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    max-width: 12rem;
    max-height: 6rem;
    @include transition($transition-base);
  }
}
</style>
