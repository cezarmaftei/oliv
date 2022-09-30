<script setup>
import FormLogin from "@/components/form/FormLogin.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import BtnClose from "../button/BtnClose.vue";
const store = useOlivStore();

const closeBtn = ref(false);

const loginModal = ref(false);
onMounted(() => {
  loginModal.value = new Modal("#login-modal");
});

const loginAction = () => {
  // Close modal if user is successfully logged in
  if (store.userData.loggedIn) {
    loginModal.value.hide();
  }
};
</script>
<template>
  <div
    class="modal fade"
    id="login-modal"
    tabindex="-1"
    aria-labelledby="login-modal-label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-md">
      <div class="modal-content">
        <div class="modal-body">
          <h3 class="modal-title" id="login-modal-label">
            Intra in contul tau
          </h3>
          <BtnClose
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closeBtn"
          />
          <div class="login-form">
            <FormLogin
              :isModal="true"
              @login-emit="loginAction"
              @cancelled-emit="loginModal.hide()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-form {
  max-width: 40rem;
  margin: auto;
}
</style>
