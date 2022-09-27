<script setup>
import FormLogin from "@/components/form/FormLogin.vue";
import { useOlivStore } from "@/stores/oliv.js";
import { ref } from "vue";
const store = useOlivStore();

const closeBtn = ref(false);

const loginAction = () => {
  // Close modal if user is successfully logged in
  if (store.userData.loggedIn) {
    closeBtn.value.click();
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
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="login-modal-label">
            Intra in contul tau
          </h3>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="closeBtn"
          ></button>
        </div>
        <div class="modal-body">
          <div class="login-form">
            <FormLogin
              :isModal="true"
              @login-emit="loginAction"
              @cancelled-emit="closeBtn.click()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
