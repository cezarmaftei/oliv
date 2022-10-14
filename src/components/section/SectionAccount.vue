<script setup>
import { useRoute, useRouter } from "vue-router";
import { useOlivStore } from "@/stores/oliv.js";
import FormLogin from "@/components/form/FormLogin.vue";
import FormRegistration from "@/components/form/FormRegistration.vue";
import FormResetPass from "@/components/form/FormResetPass.vue";
import FormPassRecovery from "@/components/form/FormPassRecovery.vue";
import IconTaco from "../icons/IconTaco.vue";
import IconMapMarkers from "../icons/IconMapMarkers.vue";
import IconNachos from "../icons/IconNachos.vue";

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
        router.push({ name: "home" });
      }
    });
}
</script>
<template>
  <div class="overflow-hidden flex-grow-1 container mb-8">
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

    <div class="account-menu text-center" v-if="store.userData.loggedIn">
      <div class="row justify-content-center g-2">
        <div class="col-12 col-xs-6 col-lg-4">
          <router-link
            class="account-menu-card d-flex flex-column align-items-center justify-content-center pt-3"
            to="/contul-meu/comenzile-mele/"
            ><h3 class="mb-2 mt-auto">Istoric comenzi</h3>
            <IconTaco class="mb-3" />
            <span class="btn btn-outline-dark reverse mt-auto"
              >vezi istoric comenzi</span
            ></router-link
          >
        </div>
        <div class="col-12 col-xs-6 col-lg-4">
          <router-link
            class="account-menu-card d-flex flex-column align-items-center justify-content-center pt-3"
            to="/contul-meu/adresele-mele/"
            ><h3 class="mb-2 mt-auto">Adresele mele</h3>
            <IconMapMarkers class="mb-3" />
            <span class="btn btn-outline-dark reverse mt-auto"
              >vezi adresele</span
            ></router-link
          >
        </div>
        <div class="col-12 col-xs-6 col-lg-4">
          <router-link
            class="account-menu-card d-flex flex-column align-items-center justify-content-center pt-3"
            to="/contul-meu/detalii-cont/"
            ><h3 class="mb-2 mt-auto">Detalii cont</h3>
            <IconNachos class="mb-3" />
            <span class="btn btn-outline-dark reverse mt-auto"
              >vezi detalii cont</span
            ></router-link
          >
        </div>
      </div>
      <div class="d-flex flex-wrap justify-content-center"></div>
      <button
        type="button"
        class="btn btn-outline-dark mt-4"
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

.form-outer-wrapper {
  background: $white;
  border: 2px solid $border-color;
  max-width: 40rem;
  padding: 2rem;
  margin-left: auto;
  margin-right: auto;
}

.account-menu-card {
  border: 2px solid $border-color;
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

@include media-breakpoint-up(md) {
  .container {
    border: 2px solid $border-color;
    @include padding(7rem);
  }
}
</style>
